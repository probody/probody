import mongoose from "mongoose"

const {Schema} = mongoose

const ScheduleRaiseSchema = new Schema({
  targetId: {
    type: Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
});

export default mongoose.model('ScheduleRaise', ScheduleRaiseSchema, 'scheduleRaises')
