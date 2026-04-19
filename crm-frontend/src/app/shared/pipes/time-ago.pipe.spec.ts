import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "just now" for very recent dates', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('just now');
  });

  it('should return "5m ago" for dates 5 minutes ago', () => {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(fiveMinsAgo)).toBe('5m ago');
  });

  it('should return "2h ago" for dates 2 hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(pipe.transform(twoHoursAgo)).toBe('2h ago');
  });

  it('should return "3d ago" for dates 3 days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(threeDaysAgo)).toBe('3d ago');
  });

  it('should return date string for dates older than a week', () => {
    const olderDate = new Date('2023-01-01');
    expect(pipe.transform(olderDate)).toBe(olderDate.toLocaleDateString());
  });
});
