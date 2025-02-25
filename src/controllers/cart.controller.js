const User = require('../models/user');
const { SuccessResponse } = require('../core/success');
const { NotFoundError, DatabaseError, BadRequest } = require('../core/error');

class CartController {
  async getCart(req, res) {
    if (!req?.user?._id) {
      throw new BadRequest('Missing Param');
    }
    const carts = await User.findById(req.user._id).select('cart').populate('cart.product');
    return SuccessResponse.ok(res, carts, 'OK!');
  }

  async addToCart(req, res) {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      throw new BadRequest('Missing param!');
    }
    if (quantity <= 0) {
      throw new BadRequest('Quantity must be greater than 0!');
    }

    if ((await Article.findById(product_id)) === null) {
      throw new NotFoundError('Product not found!');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
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
    if (!user) {
      throw new DatabaseError('Something Error!');
    }

    return SuccessResponse.created(res, user, 'Add to cart successfully!');
  }

  async updateAmount(req, res) {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      throw new BadRequest('Missing param!');
    }
    if (quantity <= 0) {
      throw new BadRequest('Quantity must be greater than 0!');
    }

    let quantityUpdate = parseInt(quantity);

    const result = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        'cart.product': product_id
      },
      {
        $set: {
          'cart.$.quantity': 'cart.$.quantity' + quantityUpdate
        }
      },
      {
        new: true
      }
    );

    if (!result) {
      throw new DatabaseError('Something Error!');
    }

    return SuccessResponse.ok(res, result, 'Update amount successfully!');
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
    if (!result) {
      throw new DatabaseError('Something Error!');
    }
    return SuccessResponse.ok(res, result, 'Remove item successfully!');
  }
}

module.exports = new CartController();
