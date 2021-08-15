import { TodoList } from './todo-list';

describe('TodoList', () => {
  it('should create an instance', () => {
    expect(new TodoList('5b4b6584-ba47-4053-aaa9-02bcc1ce189f', 'My List 1', 'My description...', new Date(21,1, 2021), new Date(21,1, 2021), null, '#808080' )).toBeTruthy();
  });
});
