const express = require('express');
const Session = require('../models/session');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tags } = req.query;
    
    const query = { status: 'published' };
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const sessions = await Session.find(query)
      .populate('user_id', 'email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      message: 'Server error while fetching sessions'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      status: 'published'
    }).populate('user_id', 'email');

    if (!session) {
      return res.status(404).json({
        message: 'Session not found'
      });
    }

    res.json({ session });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      message: 'Server error while fetching session'
    });
  }
});

module.exports = router;
