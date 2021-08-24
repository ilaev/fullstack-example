import { DateTime } from 'luxon';
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
      DateTime.utc(2021, 1, 21),
      DateTime.now().toUTC(),
      DateTime.now().toUTC(),
      null,
      false
    )).toBeTruthy();
  });
});
