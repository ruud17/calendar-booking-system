const request = require('supertest');
const express = require('express');
const { getUserAvailableTimeSlots } = require('../../controllers/calendarController');
const { getAvailableTimeSlots } = require('../../services/calendarService');

jest.mock('../../services/calendarService');

const app = express();
app.use(express.json());

app.get('/api/calendar', getUserAvailableTimeSlots);

describe('GET /api/calendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HTTP request with the correct query parameters', async () => {
    getAvailableTimeSlots.mockResolvedValue([]);

    const response = await request(app).get('/api/calendar?hostUserId=testUser');

    expect(response.status).toBe(200);
    expect(getAvailableTimeSlots).toHaveBeenCalledWith('testUser');
  });

  it('should handle missing query parameters gracefully', async () => {
    getAvailableTimeSlots.mockResolvedValue([]);

    const response = await request(app).get('/api/calendar');

    expect(response.status).toBe(200);
    expect(getAvailableTimeSlots).toHaveBeenCalledWith(undefined);
  });

  it('should respond with a 500 status code on service failure', async () => {
    getAvailableTimeSlots.mockRejectedValue(new Error('Error fetching slots'));

    const response = await request(app).get('/api/calendar?hostUserId=testUser');

    expect(response.status).toBe(500);
  });
});
