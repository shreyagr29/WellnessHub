const express = require('express');
const { body, validationResult } = require('express-validator');
const Session = require('../models/session');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user_id: req.user._id };
    if (status && ['draft', 'published'].includes(status)) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error while fetching sessions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ session });

  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Server error while fetching session' });
  }
});

router.post('/save-draft', [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('json_file_url')
    .trim()
    .notEmpty().withMessage('JSON file URL is required')
    .isURL().withMessage('Please enter a valid URL'),
  body('tags')
    .optional().isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional().trim().isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters'),
  body('id')
    .optional().isMongoId().withMessage('Invalid session ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, tags = [], json_file_url, id } = req.body;
    let session;

    if (id) {
      session = await Session.findOne({
        _id: id,
        user_id: req.user._id,
        status: 'draft'
      });

      if (!session) {
        return res.status(404).json({ message: 'Draft session not found' });
      }

      session.title = title;
      session.tags = tags.filter(tag => tag.trim() !== '');
      session.json_file_url = json_file_url;
      await session.save();

    } else {
      session = new Session({
        user_id: req.user._id,
        title,
        tags: tags.filter(tag => tag.trim() !== ''),
        json_file_url,
        status: 'draft'
      });
      await session.save();
    }

    res.json({ message: 'Draft saved successfully', session });

  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ message: 'Server error while saving draft' });
  }
});

router.post('/publish', [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('json_file_url')
    .trim()
    .notEmpty().withMessage('JSON file URL is required')
    .isURL().withMessage('Please enter a valid URL'),
  body('tags')
    .optional().isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional().trim().isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters'),
  body('id')
    .optional().isMongoId().withMessage('Invalid session ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, tags = [], json_file_url, id } = req.body;
    let session;

    if (id) {
      session = await Session.findOne({
        _id: id,
        user_id: req.user._id
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      session.title = title;
      session.tags = tags.filter(tag => tag.trim() !== '');
      session.json_file_url = json_file_url;
      session.status = 'published';
      await session.save();

    } else {
      session = new Session({
        user_id: req.user._id,
        title,
        tags: tags.filter(tag => tag.trim() !== ''),
        json_file_url,
        status: 'published'
      });
      await session.save();
    }

    res.json({ message: 'Session published successfully', session });

  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ message: 'Server error while publishing session' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error while deleting session' });
  }
});

module.exports = router;
