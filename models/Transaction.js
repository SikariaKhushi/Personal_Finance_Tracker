const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ['EXPENSE', 'INCOME'],
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  tags: {
    type: [String],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
}, {
  timestamps: true,
});

transactionSchema.index({ userId: 1 });
transactionSchema.index({ categoryId: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ description: 'text' });
transactionSchema.index({ tags: 1 });
transactionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Transaction', transactionSchema);