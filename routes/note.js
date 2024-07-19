const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/notes', auth, async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      userId: req.user._id
    });
    await note.save();
    res.status(201).send(note);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/notes', auth, async (req, res) => {
  try {
    //console.log("req: ",req)
    const notes = await Note.find({ userId: req.user._id });
    console.log("notes: ",notes)
    res.send(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ noteId: req.params.id, userId: req.user._id });
    console.log(note)
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/notes/:id', auth, async (req, res) => {
  console.log(req.body)
  console.log(req.params.id)
  console.log(req.user._id)
  try {
    const note = await Note.findOneAndUpdate(
      { noteId: req.params.id, userId: req.user._id },
      {title: req.body.modaltitle, body:req.body.modalbody, tags: req.body.modaltags},
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (err) {
    console.log(err)
    res.status(400).send(err);
  }
});

router.delete('/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ noteId: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
