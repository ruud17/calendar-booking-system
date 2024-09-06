const timeSlotConfig = {
  startHour: 9, // Start of the workday (9 AM)
  endHour: 16, // End of the workday (4 PM, last slot ends at 5 PM)
  slotDuration: 1, // Duration of each time slot in hours
};

const dayRangeConfig = {
  daysFromNow: 1, // Start looking for slots 1 day from now
  rangeLength: 7, // Look for slots over a 7-day period
};

const calendarApiResponse = {
  name: 'Eng Test User',
  timeslotLengthMin: 60,
};

const dateTimeFormat = {
  local: 'YYYY-MM-DDTHH:mm:ss.SSS',
};

module.exports = { timeSlotConfig, dayRangeConfig, calendarApiResponse, dateTimeFormat };
