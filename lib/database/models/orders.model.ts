import { Schema, model, models } from 'mongoose'

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Events',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
})

const Orders = models?.Orders || model('Orders', OrderSchema)

export default Orders