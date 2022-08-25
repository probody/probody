import mongoose from "mongoose"
import {DateTime} from 'luxon'

const {Schema} = mongoose

const AuthorizedTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        default: () => {
            return DateTime.now().plus({months: 1}).toJSDate()
        }
    }
}, {
    versionKey: false,
    timestamps: false
});

export default mongoose.model('AuthorizedToken', AuthorizedTokenSchema, 'authorizedTokens')
