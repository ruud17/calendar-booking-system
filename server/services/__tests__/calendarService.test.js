const moment = require('moment');
const { getAvailableTimeSlots } = require('../calendarService');
const { dateTimeFormat } = require('../../config/config');
const db = require('../../../mock/db');

jest.mock('../../../mock/db');
const today = moment().startOf('day');

describe('Calendar Service - getAvailableTimeSlots', () => {
  beforeEach(() => {
    // Mock the database response to return events
    db.calendar.findEventsForUser.mockResolvedValue([
      {
        start: today.clone().add(1, 'days').add(10, 'hour').format(dateTimeFormat.local),
        end: today.clone().add(1, 'days').add(11, 'hour').add(30, 'minutes').format(dateTimeFormat.local), // 2 slots busy
      },
      {
        start: today.clone().add(2, 'days').add(12, 'hour').format(dateTimeFormat.local),
        end: today.clone().add(2, 'days').add(14, 'hour').add(45, 'minutes').format(dateTimeFormat.local), // 3 slots busy
      },
      {
        start: today.clone().add(3, 'days').add(9, 'hour').format(dateTimeFormat.local),
        end: today.clone().add(3, 'days').add(16, 'hour').format(dateTimeFormat.local), // 7 slots busy
      },
    ]);
  });

  it('should return available time slots that do not overlap with user events', async () => {
    const result = await getAvailableTimeSlots('testUser');

    const totalSlots = 7 * 8; // 7 days * 8 slots = 56 total slots
    const busySlots = 2 + 3 + 7; // Sum of busy slots from the mock
    const expectedAvailableSlots = totalSlots - busySlots;

    expect(result.length).toEqual(expectedAvailableSlots);

    // Check for specific expected time slots
    expect(result).toEqual(
      expect.arrayContaining([
        today.clone().add(1, 'days').add(9, 'hour').format(dateTimeFormat.local),
        today.clone().add(1, 'days').add(15, 'hour').format(dateTimeFormat.local),
        today.clone().add(2, 'days').add(11, 'hour').format(dateTimeFormat.local),
        today.clone().add(3, 'days').add(16, 'hour').format(dateTimeFormat.local),
        today.clone().add(4, 'days').add(9, 'hour').format(dateTimeFormat.local),
        today.clone().add(5, 'days').add(11, 'hour').format(dateTimeFormat.local),
      ])
    );

    // Check that overlapping slots are NOT in the result
    expect(result).toEqual(
      expect.not.arrayContaining([
        today.clone().add(1, 'days').add(10, 'hour').format(dateTimeFormat.local), // Overlaps with the first event
        today.clone().add(1, 'days').add(11, 'hour').format(dateTimeFormat.local), // Overlaps with the first event
        today.clone().add(1, 'days').add(12, 'hour').format(dateTimeFormat.local), // Overlaps with the first event
        today.clone().add(2, 'days').add(13, 'hour').format(dateTimeFormat.local), // Overlaps with the second event
        today.clone().add(2, 'days').add(14, 'hour').format(dateTimeFormat.local), // Overlaps with the second event
        today.clone().add(3, 'days').add(9, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
        today.clone().add(3, 'days').add(10, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
        today.clone().add(3, 'days').add(11, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
        today.clone().add(3, 'days').add(12, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
        today.clone().add(3, 'days').add(13, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
        today.clone().add(3, 'days').add(14, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
        today.clone().add(3, 'days').add(15, 'hour').format(dateTimeFormat.local), // Overlaps with the third event
      ])
    );
  });
});
