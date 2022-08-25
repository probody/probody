import mongoose from "mongoose"

const {Schema} = mongoose

const ArticleTagSchema = new Schema({
  phone: {
    type: String,
    required: true
  },
  messageText: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
});

export default mongoose.model('SupportTicket', ArticleTagSchema, 'supportTickets')
