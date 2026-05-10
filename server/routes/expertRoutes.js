const express = require('express');
const {
  getExperts,
  seedExperts,
  getExpertById,
} = require('../controllers/expertController');

const router = express.Router();

router.get('/', getExperts);
router.post('/seed', seedExperts);
router.get('/:id', getExpertById);

module.exports = router;
