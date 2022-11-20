const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
          validator: function(v) {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
          },
          message: props => `${props.value} is not a valid email!`
        }
    },
    role: {
        type: [String],
        enum: {
            values: ['admin', 'developer', 'legal', 'analyst', 'support'],
            message: '{VALUE} is not supported'
        },
        required: true
    },
    permissions: {
        type: [String],
        enum: {
            values: ['admin', 'developer', 'legal', 'analyst', 'support']
        },
        required: true,
    },
    adminUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status: {
        type: String,
        // default: 'verificationPending'
        enum: {
            values: ['active', 'AccountCreated']
        }
    },
    password: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: false
    },
    // privacypolicyresponse: { type: Boolean, default: false },
    // termsandconditions: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: true, updatedAt: true }
})

module.exports = userSchema;