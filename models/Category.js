const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['EXPENSE', 'INCOME'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
  },
  color: {
    type: String,
  },
}, {
  timestamps: true,
});

categorySchema.index({ userId: 1, name: 1 }, { unique: true });
categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ name: 'text' });

module.exports = mongoose.model('Category', categorySchema);