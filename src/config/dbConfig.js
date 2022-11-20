const mongoose = require('mongoose');
const config = require('./index');

// Load schemas 
const userSchema = require('../models/User')
const codeSchema = require('../models/Code')


const MONGO_URI = config.MONGO_URI+"/omega_support"

const connection = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
       
})

const User = connection.model('User', userSchema)
const Code = connection.model('Code', codeSchema)




module.exports = {
    User,
    Code
}