const { Schema } = require('mongoose')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    email: String,
    password: String
})


module.exports = mongoose.model('users', userSchema)