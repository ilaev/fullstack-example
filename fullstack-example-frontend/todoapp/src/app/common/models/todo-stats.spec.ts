import { TodoStats } from './todo-stats';

describe('TodoStats', () => {
  it('should create an instance', () => {
    expect(new TodoStats(1, 2)).toBeTruthy();
  });

  it('should return percentage of marked as done items.', () => {
    expect(new TodoStats(1, 2).numberOfItemsMarkedAsDonePercentage).toEqual(50);
  });
});
