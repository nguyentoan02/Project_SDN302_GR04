const mongoose = require('mongoose');
const { SuccessResponse } = require('../core/success');
const {
  NotFoundError,
  DatabaseError,
  BadRequest,
  AuthenticationError,
  AppError
} = require('../core/error');

const User = require('../models/user');
const Product = require('../models/Product');

class CartController {
  async getCart(req, res) {
    if (!req.user) throw new AuthenticationError('Missing Param _id');

    const { _id } = req.user;

    if (!_id) {
      throw new AuthenticationError('Missing Param');
    }

    const data = await User.findById(_id)
      .select('cart')
      .populate({
        path: 'cart.product',
        select: 'name price image stock description'
      })
      .lean();

    if (data) {
      console.log(data.cart);
    }

    res.render('pages/cart/cart', {
      title: 'Cart',
      user: req.user,
      carts: data?.cart || []
    });
  }

  async addToCart(req, res) {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      throw new BadRequest('Missing param!');
    }
    if (quantity <= 0) {
      throw new BadRequest('Quantity must be greater than 0!');
    }

    const product = await Product.findById(product_id);

    if (!product) {
      throw new NotFoundError('Product not found!');
    }

    if (product.stock < quantity) {
      throw new BadRequest('Quantity over stock!');
    }

    const updateStockProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        $inc: { stock: -quantity }
      },
      {
        new: true
      }
    );

    if (!updateStockProduct) {
      throw new AppError('Update Stock Fail!');
    }

    const _id = req.user._id;

    const existingCart = await User.findOne({
      _id,
      'cart.product': product_id
    });

    let result;

    if (existingCart) {
      result = await User.findOneAndUpdate(
        {
          _id,
          'cart.product': product_id
        },
        {
          $inc: {
            'cart.$.quantity': quantity
          }
        },
        { new: true }
      );
    } else {
      result = await User.findByIdAndUpdate(
        _id,
        {
          $push: {
            cart: {
              product: product_id,
              quantity: quantity
            }
          }
        },
        {
          new: true
        }
      );
    }

    if (!result) {
      throw new DatabaseError('Something Error!');
    }

    return SuccessResponse.created(res, { product_id }, 'Add to cart successfully!');
  }

  async updateAmount(req, res) {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      throw new BadRequest('Missing param!');
    }

    const quantityUpdate = parseInt(quantity);

    if (isNaN(quantityUpdate)) {
      throw new BadRequest('Quantity must be a  number!');
    }

    // Check product availability and stock
    const product = await Product.findById(product_id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (quantityUpdate > 0 && product.stock < quantityUpdate) {
      throw new BadRequest(`Only ${product.stock} items available in stock`);
    }

    const _id = req?.user?._id;

    if (!_id) {
      throw new BadRequest('Missing User Credential');
    }

    await Product.findByIdAndUpdate(
      product_id,
      {
        $inc: { stock: -quantityUpdate }
      },
      {
        new: true
      }
    );

    const result = await User.findOneAndUpdate(
      {
        _id,
        'cart.product': product_id
      },
      {
        $inc: {
          'cart.$.quantity': quantityUpdate
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!result) {
      throw new DatabaseError('Something Error!');
    }

    return SuccessResponse.ok(res, result.cart, 'Update amount successfully!');
  }

  async removeItem(req, res) {
    const { product_id } = req.body;

    if (!product_id) {
      throw new BadRequest('Missing param!');
    }

    const result = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        cart: {
          product: product_id
        }
      }
    });

    await Product.findByIdAndUpdate(
      product_id,
      {
        $inc: { stock: 1 }
      },
      {
        new: true
      }
    );

    if (!result) {
      throw new DatabaseError('Something Error!');
    }
    return SuccessResponse.ok(res, result, 'Remove item successfully!');
  }

  validateCartInput(product_id, quantity) {
    if (!product_id || !quantity) {
      throw new BadRequest('Missing product ID or quantity');
    }
    if (quantity <= 0) {
      throw new BadRequest('Quantity must be greater than 0');
    }
  }

  async updateUserCart(userId, product_id, quantity) {
    const existingCart = await User.findOne({
      _id: userId,
      'cart.product': product_id
    });

    if (existingCart) {
      return User.findOneAndUpdate(
        {
          _id: userId,
          'cart.product': product_id
        },
        {
          $inc: { 'cart.$.quantity': quantity }
        },
        { new: true }
      );
    }

    return User.findByIdAndUpdate(
      userId,
      {
        $push: {
          cart: {
            product: product_id,
            quantity: quantity
          }
        }
      },
      { new: true }
    );
  }
}

module.exports = new CartController();
