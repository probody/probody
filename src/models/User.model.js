import mongoose from "mongoose"
import ReffCode from "../helpers/ReffCode.js"

const {Schema} = mongoose

const UserSchema = new Schema({
  phone: {
    unique: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: ''
  },
  internalRole: {
    type: String,
    enum: ['admin', 'owner', 'manager', 'master']
  },
  balance: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['serviceProvider', 'admin', 'manager'],
    default: 'serviceProvider'
  },
  paymentCode: {
    type: String,
    default: ReffCode.generate
  },
  name: {
    type: String
  },
  approvedEmail: {
    type: Boolean,
    default: false
  },
  subscriptionTo: {
    type: Date,
    default() {
      return new Date(0)
    }
  }
}, {
  versionKey: false,
  timestamps: true
});

export default mongoose.model('User', UserSchema)
