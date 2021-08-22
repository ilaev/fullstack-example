import { MatrixX, MatrixY } from 'src/app/common/models';
import { TodoItem } from './todo-item';

describe('TodoItem', () => {
  it('should create an instance', () => {
    expect(new TodoItem(
      'id',
      null,
      'a name',
      MatrixX.NotUrgent,
      MatrixY.NotImportant,
      'a note',
      new Date(9999,1, 1),
      new Date(),
      new Date(),
      null,
      false
    )).toBeTruthy();
  });
});
