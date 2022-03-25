import { DateTime } from 'luxon';
import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('960b9dbc-87c1-492c-b042-84d4dab14e9d', 'me@ilaev.de', 'Helmut Friedrich Stern', DateTime.now().toUTC(), DateTime.now().toUTC())).toBeTruthy();
  });
});
