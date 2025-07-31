const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  json_file_url: {
    type: String,
    required: [true, 'JSON file URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for better query performance
sessionSchema.index({ user_id: 1, status: 1 });
sessionSchema.index({ status: 1, createdAt: -1 });
sessionSchema.index({ tags: 1 });

module.exports = mongoose.model('Session', sessionSchema);
