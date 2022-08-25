import mongoose from "mongoose"

const {Schema} = mongoose

const DefaultProgramSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: false
});

export default mongoose.model('DefaultProgram', DefaultProgramSchema, 'defaultPrograms')
