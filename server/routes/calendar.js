const express = require('express');
const { getUserAvailableTimeSlots } = require('../controllers/calendarController');

const router = express.Router();

router.get('/api/calendar', getUserAvailableTimeSlots);

module.exports = router;
