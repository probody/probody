import mongoose from "mongoose"
import Numbers from "../helpers/Numbers.js"
import CyrillicToTranslit from 'cyrillic-to-translit-js'

const {Schema} = mongoose

const BlogArticleSchema = new Schema({
  title: {
    type: String
  },
  photos: {
    type: [String]
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: 'ArticleTag'
  },
  slug: {
    type: String,
    default() {// Привет, мир! => privet-mir-25
      return (new CyrillicToTranslit).transform(this.title.replace(/[&\/\\#,!+()$~%.'":*?<>{}]/g, '').trim(), '-') + Numbers.random(1, 1000)
    }
  },
  text: {
    type: String,
    required: true,
    index: 'text'
  }
}, {
  versionKey: false,
  timestamps: true
});

export default mongoose.model('BlogArticle', BlogArticleSchema, 'blogArticles')
