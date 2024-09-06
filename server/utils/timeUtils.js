const moment = require('moment');

function getStartAndEndDate(daysFromNow, rangeLength) {
  const startDate = moment().add(daysFromNow, 'days').startOf('day');
  const endDate = startDate.clone().add(rangeLength, 'days');

  return { startDate, endDate };
}

function generateTimeSlots(startDate, endDate, slotConfig) {
  const { startHour, endHour, slotDuration } = slotConfig;
  let timeSlots = [];

  for (let day = startDate.clone(); day.isBefore(endDate); day.add(1, 'days')) {
    for (let hour = startHour; hour <= endHour; hour++) {
      const slotStart = day.clone().hour(hour).minute(0).second(0);
      const slotEnd = slotStart.clone().add(slotDuration, 'hour');
      timeSlots.push({ start: slotStart, end: slotEnd });
    }
  }

  return timeSlots;
}

function isSlotOverlapsWithAnyEvent(slot, events) {
  return events.some((event) => {
    const eventStart = moment(event.start);
    const eventEnd = moment(event.end);

    return slot.start.isBefore(eventEnd) && slot.end.isAfter(eventStart);
  });
}

function isSlotAvailable(slot, hostEvents, guestEvents) {
  const slotOverlapsWithHostEvents = isSlotOverlapsWithAnyEvent(slot, hostEvents);
  const slotOverlapsWithGuestEvents = isSlotOverlapsWithAnyEvent(slot, guestEvents);

  return !(slotOverlapsWithHostEvents || slotOverlapsWithGuestEvents);
}

module.exports = { getStartAndEndDate, generateTimeSlots, isSlotAvailable };
