const mongoose = require('mongoose');
const Counter = require('./Counter');

const NoteSchema = new mongoose.Schema({
  noteId: { type: Number, unique: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: [String], default: [] },
}, { timestamps: true });

NoteSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'noteId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.noteId = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Note', NoteSchema);
