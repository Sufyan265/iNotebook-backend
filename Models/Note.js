const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        // Ye syntax Model "User" ko Model "Notes" k sath link kry ga ("Type:" me user id store ho jay gi) ↓ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: false,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("notes", NotesSchema);