const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Username: { type: String , required: true },
    email: { type: String , required: true },
    password: { type: String , required: true },
    // phone:{ type : String , required: true},
    create: { type: Date, default: Date.now }
})

const User = mongoose.model('loguser', userSchema);
module.exports = User;