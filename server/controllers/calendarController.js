const { getAvailableTimeSlots } = require('../services/calendarService');
const { calendarApiResponse } = require('../config/config');
const errorMessages = require('../config/errorMessages');

const getUserAvailableTimeSlots = async (req, res) => {
  const { hostUserId, guestUserId } = req.query;

  try {
    const availableTimeSlots = await getAvailableTimeSlots(hostUserId, guestUserId);

    res.json({
      ...calendarApiResponse,
      timeslots: availableTimeSlots,
    });
  } catch (error) {
    res.status(500).json({ error: errorMessages.calendarService.fetchError });
  }
};

module.exports = { getUserAvailableTimeSlots };
