const Order = require('../models/Order');
const User = require('../models/user');
const Product = require('../models/Product');
const { BadRequest, NotFoundError } = require('../core/error');
const { SuccessResponse } = require('../core/success');

class OrderController {
  async createOrderFromSelectedProducts(req, res) {
    const { product_ids, payment_method, shipping_cost } = req.body;

    if (!Array.isArray(product_ids) || product_ids.length === 0) {
      throw new BadRequest('Please select products to order');
    }

    const userId = req.user._id;
    const cartUser = await User.findById(userId).populate('cart.product');

    if (!cartUser || !cartUser.cart.length) {
      throw new NotFoundError('Cart is empty');
    }

    const selectedItems = cartUser.cart.filter((item) =>
      product_ids.includes(item.product._id.toString())
    );

    if (selectedItems.length !== product_ids.length) {
      throw new BadRequest('Some selected products are not in your cart');
    }

    const orderProducts = selectedItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    for (const item of orderProducts) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product with ID ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequest(`Insufficient stock for product ${product.name}`);
      }
    }

    // Update product stock
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: { stock: -item.quantity }
        },
        { new: true }
      );
    }

    const totalAmount = orderProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      products: orderProducts,
      totalAmount: totalAmount + (shipping_cost || 0),
      paymentMethod: payment_method
    });

    await order.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cart: {
            product: { $in: product_ids }
          }
        }
      },
      {
        new: true
      }
    );

    return SuccessResponse.created(
      res,
      {
        order,
        updatedCart: updatedUser.cart
      },
      'Order created successfully'
    );
  }

  async getAllOrders(req, res) {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate('products.productId')
      .populate('userId', 'username email')
      .sort({ orderDate: -1 })
      .lean();

    orders.forEach((o) => {
      console.log({ order: o.products });
    });

    return res.render('pages/order/orderHistory', {
      title: 'Order History',
      user: req.user,
      orders: orders || []
    });
  }

  async getOrderById(req, res) {
    const { orderId } = req.params;
    const userId = req.user._id;

    if (!orderId) {
      throw new BadRequest('Order ID is required');
    }

    const order = await Order.findOne({
      _id: orderId,
      userId
    })
      .populate('products.productId')
      .populate('userId', 'username email');

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return SuccessResponse.ok(res, order, 'Order retrieved successfully');
  }
}

module.exports = new OrderController();
