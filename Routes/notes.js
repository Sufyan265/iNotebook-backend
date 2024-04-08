const express = require('express');
const router = express.Router();
const Note = require("../Models/Note");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all notes using: GET: "/api/notes/getallnotes". Login required ↓ 
router.get("/getallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.send(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})

// ROUTE 2: Add a new Note using: POST: "/api/notes/addnote". Login required ↓ 
// use "fetchuser" for get data from user id ↓ 
router.post("/addnote", fetchuser, [
    body('title', "Please! Enter title").notEmpty(),
    // "description" ki minimum 6 length required hogi ↓ 
    body('description', "Please! Type the description must be 5 crackters").isLength({ min: 5 })
], async (req, res) => {
    try {
        // using of express velidater ↓ 
        const error = validationResult(req);
        // if there are errors its return bad request and errors ↓ 
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }
        const { title, description, tag } = req.body;
        // Model "Note" ko data bhejny k liye ↓ 
        const note = new Note({ title, description, tag, user: req.user.id })
        // ye promise return kry ga is liye use "await" ↓
        const savedNote = await note.save();
        res.send(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})


// ROUTE 2: Update an existing Note using: PUT: "/api/notes/updatenote/:id". Login required ↓
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // New data object for update ↓ 
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to be updated and update it ↓ 
        // "req.params.id" params mean jo id endpoint k ander de rakhi ha usy use krna ↓ 
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }
        // if the "params id" and req.user.id are not equals to return error ↓ 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        // "findByIdAndUpdate" 3 cheezy ly ga. id, new note, new: true. ($set: sy hm new note object send kr skty he) ↓ 
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3: Delete an existing Note using: DELETE: "/api/notes/deletenote/:id". Login required ↓
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // Find the note to be updated and update it ↓ 
        // "req.params.id" params mean jo id endpoint k ander de rakhi ha usy use krna ↓ 
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }
        // if the "params id" and req.user.id are not equals to return error ↓ 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        // "findByIdAndUpdate" 3 cheezy ly ga. id, new note, new: true. ($set: sy hm new note object send kr skty he) ↓ 
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted by the id of: " + req.params.id })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router