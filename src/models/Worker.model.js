import mongoose from "mongoose"
import PointSchema from "./Point.schema.js";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import Numbers from "../helpers/Numbers.js";

const {Schema} = mongoose

const WorkerSchema = new Schema({
    kind: {
        type: String,
        enum: ["master", "salon"],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address: {
        type: String
    },
    location: {
        type: PointSchema,
        index: '2dsphere'
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Worker"
    },
    lastRaise: {
        type: Date,
        default: new Date
    },
    raises: {
        type: [Date],
        default: []
    },
    messengers: {
        tg: {
            type: String
        },
        wa: {
            type: String
        }
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
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String
    },
    phone: {
        type: String
    },
    characteristics: {
        height: {
            type: Number,
            min: 70,
            max: 250
        },
        weight: {
            type: Number,
            min: 30,
            max: 150
        },
        hair: {
            type: String,
            enum: ["брюнетка", "блондинка", "седая", "русая", "рыжая", "шатенка", "другая"]
        },
        eyes: {
            type: String,
            enum: ["голубые", "синие", "зеленые", "карие", "серые", "черные", "желтые", "другие"]
        },
        age: {
            type: Number,
            min: 18,
            max: 99
        },
        bust: {
            type: Number,
            enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]
        },
        show: {
            type: Boolean
        }
    },
    region: {
        type: Schema.Types.ObjectId,
        ref: "Region"
    },
    services: {
        type: [Schema.Types.ObjectId],
        ref: "Service"
    },
    programs: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            enum: [15, 30, 60, 90],
            required: true
        },
        classicCnt: {
            type: Number,
            min: 0,
            max: 3,
            required: true
        },
        eroticCnt: {
            type: Number,
            min: 0,
            max: 3,
            required: true
        },
        relaxCnt: {
            type: Number,
            min: 0,
            max: 3,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    }],
    avgCost: {
        type: Number,
        default() {
            if (this.programs.length === 0) {
                return 0
            }

            return Math.round(this.programs.reduce((acc, cur) => acc + (Number(cur.cost) / Number(cur.duration) * 60), 0) / this.programs.length)
        }
    },
    rooms: {
        type: Number,
        default: 1,
        min: 1,
        max: 20
    },
    leads: {
        type: [Schema.Types.ObjectId],
        ref: "Lead"
    },
    photos: {
        type: [String],
        required: true
    },
    slug: {
        type: String,
        default() {// Привет, мир! => privet-mir25
            return (new CyrillicToTranslit).transform(this.name.replace(/[&\/\\#,!+()$~%.'":*?<>{}]/g, '').trim(), '-') + Numbers.random(1, 1000)
        }
    },
    workHours: {
        from: {
            type: String
        },
        to: {
            type: String
        },
        roundclock: {
            type: Boolean,
            default: false
        }
    },
    workDays: {
        type: [String],
        enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    },
    paused: {
        type: Boolean,
        default: false
    },
    hideFromArchive: {
        type: Boolean,
        default: false
    },
    approvalState: {
        type: String,
        enum: ["waiting", "approved", "declined"],
        default: 'waiting'
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('Worker', WorkerSchema)
