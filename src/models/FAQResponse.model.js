import mongoose from "mongoose"

const {Schema} = mongoose

const FAQSchema = new Schema({
    faqId: {
        type: Schema.Types.ObjectId,
        ref: "FAQ",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    isUseful: {
        type: Boolean,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('FAQResponse', FAQSchema, 'faqResponse')
