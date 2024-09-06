const db = require('../../mock/db');
const { timeSlotConfig, dayRangeConfig, dateTimeFormat } = require('../config/config');
const { getStartAndEndDate, generateTimeSlots, isSlotAvailable } = require('../utils/timeUtils');

async function getAvailableTimeSlots(hostUserId, guestUserId) {
  let guestEvents = [];

  const { daysFromNow, rangeLength } = dayRangeConfig;
  const userEvents = await db.calendar.findEventsForUser(hostUserId);

  if (typeof guestUserId != 'undefined') {
    guestEvents = await db.calendar.findEventsForUser(guestUserId);
  }

  const { startDate, endDate } = getStartAndEndDate(daysFromNow, rangeLength);

  const timeSlots = generateTimeSlots(startDate, endDate, timeSlotConfig);

  const availableTimeSlots = timeSlots.filter((slot) => isSlotAvailable(slot, userEvents, guestEvents));

  return availableTimeSlots.map((slot) => slot.start.format(dateTimeFormat.local));
}

module.exports = { getAvailableTimeSlots };
