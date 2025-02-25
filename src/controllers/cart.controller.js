const mongoose = require('mongoose');
const { SuccessResponse } = require('../core/success');
const { NotFoundError, DatabaseError, BadRequest } = require('../core/error');

const User = require('../models/user');
const Product = require('../models/Product');

class CartController {
  async getCart(req, res) {
    if (!req?.user?._id) {
      throw new BadRequest('Missing Param');
    }
    const carts = await User.findById(_id).select('cart');
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

    if ((await Product.findById(product_id)) === null) {
      throw new NotFoundError('Product not found!');
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

    const _id = req.user._id;

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
    if (!result) {
      throw new DatabaseError('Something Error!');
    }
    return SuccessResponse.ok(res, result, 'Remove item successfully!');
  }
}

module.exports = new CartController();
