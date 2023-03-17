import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const campfireSchema = new Schema({
    topic: {
        type: String,
        required: [true, 'Topic is required.'],
        minLength: 1,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s]+(\s+[^\s]+)*$/.test(v);
            },
            message: props => 'Topic must not start or end with whitespace.'
        },
    },
    altTopic: {
        type: String,
        required: [true, 'altTopic is required.'],
        minLength: 3,
        lowercase: true,
    },
    duration: String,
    description: {
        type: String,
        required: [true, 'Description is required.'],
        validate: {
            validator: function(v) {
                return /^[^\s]+(\s+[^\s]+)*$/.test(v);
            },
            message: props => 'Description must not start or end with whitespace.'
        },
    },
    creator: {
        type: {
            uid: {
                type: String,
                required: true,
                unique: true,
            },
            profileUrl: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                default: false,
            },
            peerId: {
                type: String,
                default: ''
            },
            socketId: {
                type: String,
                default: ''
            },
        },
        '_id': false,
        required: [true, 'Creator is required.'],
    },
    hidden: Boolean,
    scheduleToStart: {
        type: Date,
        default: new Date(),
    },
    openTo: {
        type: String,
        default: 'Everyone',
        enum: {
            values: ['Everyone', 'Invite Only'],
            message: '{VALUE} is not supported'
        }
    },
    members: [
        {
            uid: {
                type: String,
                required: true,
            },
            profileUrl: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                default: 'pending'
            },
            role: {
                type: String,
                default: 'audience'
            },
            campfire: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                default: false,
            },
            peerId: {
                type: String,
                default: ''
            },
            socketId: {
                type: String,
                default: ''
            },
            '_id': false,
        }
    ]
}, { timestamps: true });

const Campfire = mongoose.models.Campfire || mongoose.model('Campfire', campfireSchema);

export default Campfire;
