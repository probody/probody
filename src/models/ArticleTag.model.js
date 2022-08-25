import mongoose from "mongoose"

const {Schema} = mongoose

const ArticleTagSchema = new Schema({
  name: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: false
});

export default mongoose.model('ArticleTag', ArticleTagSchema, 'articleTags')
