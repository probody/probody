import mongoose from "mongoose"
import CyrillicToTranslit from "cyrillic-to-translit-js";
import Numbers from "../helpers/Numbers.js";

const {Schema} = mongoose

const VacancySchema = new Schema({
    host: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    salary: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        enum: ['no', 'yes', 'nomatter'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    withdrawalType: {
        type: [String],
        enum: ['cash', 'card', 'other'],
    },
    social: {
        inst: {
            type: String
        },
        vk: {
            type: String
        },
        ws: {
            type: String
        },
        tgCh: {
            type: String
        }
    },
    withdrawalPeriod: {
        type: [String],
        enum: ['daily', 'weekly', 'monthly'],
    },
    phone: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
    },
    employment: {
        type: [String],
        enum: ['full', 'part', 'temp'],
        required: true
    },
    workSchedule: {
        type: [String],
        enum: ['flexible', 'period', 'contract', 'constant'],
        required: true
    },
    salonTitle: {
        type: String,
        required: true
    },
    salonAddress: {
        type: String,
        required: true
    },
    pic: {
      type: String,
      required: true
    },
    slug: {
        type: String,
        default() {// Привет, мир! => privet-mir25
            return (new CyrillicToTranslit).transform(this.salonTitle.replace(/[&\/\\#,!+()$~%.'":*?<>{}]/g, '').trim(), '-') + Numbers.random(1, 1000)
        }
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: "Region",
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('Vacancy', VacancySchema)
