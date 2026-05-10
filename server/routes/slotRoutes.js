const express = require('express');
const {
  getSlotsByExpert,
  bookSlot,
  seedSlots,
  seedAllSlots,
} = require('../controllers/slotController');

const router = express.Router();

router.post('/seed-all', seedAllSlots);
router.get('/:expertId', getSlotsByExpert);
router.post('/:expertId/book/:slotId', bookSlot);
router.post('/seed/:expertId', seedSlots);

module.exports = router;
