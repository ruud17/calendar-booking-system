const moment = require('moment');
const { getStartAndEndDate, generateTimeSlots, isSlotAvailable } = require('../timeUtils');

describe('timeUtils', () => {
  describe('getStartAndEndDate method', () => {
    it('should return the correct start and end date based on the input parameters', () => {
      const { startDate, endDate } = getStartAndEndDate(1, 7);

      expect(startDate.isSame(moment().add(1, 'days').startOf('day'))).toBe(true);
      expect(endDate.isSame(moment().add(1, 'days').startOf('day').add(7, 'days'))).toBe(true);
    });
  });

  describe('generateTimeSlots method', () => {
    it('should generate time slots with correct start and end times based on the configuration', () => {
      const startDate = moment('2024-08-17T00:00:00.000'); // Local time
      const endDate = moment('2024-08-18T00:00:00.000'); // Local time, 1 day later
      const timeSlotConfig = {
        startHour: 9,
        endHour: 16,
        slotDuration: 1,
      };

      const timeSlots = generateTimeSlots(startDate, endDate, timeSlotConfig);

      expect(timeSlots).toHaveLength(8); // 9AM to 4PM (8 slots)

      expect(timeSlots[0].start.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe('2024-08-17T09:00:00.000');
      expect(timeSlots[0].end.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe('2024-08-17T10:00:00.000');

      expect(timeSlots[7].start.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe('2024-08-17T16:00:00.000');
      expect(timeSlots[7].end.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe('2024-08-17T17:00:00.000');
    });
  });

  describe('isSlotAvailable method', () => {
    it('should return true if the slot does not overlap with any events', () => {
      const slot = {
        start: moment('2024-08-17T12:00:00.000'),
        end: moment('2024-08-17T13:00:00.000'),
      };

      const events = [
        {
          start: '2024-08-17T10:30:00.000',
          end: '2024-08-17T11:30:00.000',
        },
        {
          start: '2024-08-17T14:30:00.000',
          end: '2024-08-17T15:30:00.000',
        },
      ];

      const result = isSlotAvailable(slot, events);

      expect(result).toBe(true);
    });

    it('should return false if the slot overlaps with an event', () => {
      const slot = {
        start: moment('2024-08-17T09:00:00.000'),
        end: moment('2024-08-17T10:00:00.000'),
      };

      const events = [
        {
          start: '2024-08-17T09:30:00.000',
          end: '2024-08-17T11:00:00.000',
        },
      ];

      const result = isSlotAvailable(slot, events);

      expect(result).toBe(false);
    });

    it('should return false if the slot completely covers an event', () => {
      const slot = {
        start: moment('2024-08-17T09:00:00.000'),
        end: moment('2024-08-17T11:00:00.000'),
      };

      const events = [
        {
          start: '2024-08-17T09:30:00.000',
          end: '2024-08-17T10:30:00.000',
        },
      ];

      const result = isSlotAvailable(slot, events);

      expect(result).toBe(false);
    });
  });
});
