const mongoose = require('mongoose');
const { Schema } = mongoose;

// this is a module. is me hm schema user kr k user sy data ly skty he ↓ 
const UserSchema = new Schema({
    name: {
        // "name" type String honi chahye ↓ 
        type: String,
        // "required: true" sy agr user ny name add naa kiya to error aay ga ↓
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("user", UserSchema);