import mongoose from "mongoose"

const {Schema} = mongoose

const RegionSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: false
});

export default mongoose.model('Region', RegionSchema)
