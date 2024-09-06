const { getUserAvailableTimeSlots } = require('../calendarController');
const { getAvailableTimeSlots } = require('../../services/calendarService');
const errorMessages = require('../../config/errorMessages');

jest.mock('../../services/calendarService');

describe('Calendar Controller - getUserAvailableTimeSlots', () => {
  it('should return available time slots with a 200 status code', async () => {
    const req = { query: { hostUserId: 'testUser' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    getAvailableTimeSlots.mockResolvedValue(['2024-08-16T09:00:00+02:00']);

    await getUserAvailableTimeSlots(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        timeslots: ['2024-08-16T09:00:00+02:00'],
      })
    );
  });

  it('should handle errors and return a 500 status code', async () => {
    const req = { query: { hostUserId: 'testUser' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    getAvailableTimeSlots.mockRejectedValue(new Error('Error fetching slots'));

    await getUserAvailableTimeSlots(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessages.calendarService.fetchError,
    });
  });
});
