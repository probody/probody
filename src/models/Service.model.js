import mongoose from "mongoose"

const {Schema} = mongoose

const ServiceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: false
});

export default mongoose.model('Service', ServiceSchema)
