import mongoose from "mongoose"

const {Schema} = mongoose

const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    targetType: {
        type: String,
        enum: ['master', 'salon'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    answer: {
        type: String
    },
    complain: {
        type: String,
        enum: ['doNotComplain', 'noSuchClient', 'insultInReview', 'wrongFacts', 'formerEmployee', 'clientDeclined', 'ruinedOtherRules']
    },
    interior: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    massage: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    service: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    avg: {
        type: Number,
        default() {
            return (this.interior + this.massage + this.service) / 3
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('Review', ReviewSchema)
