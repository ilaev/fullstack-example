import { DateTime } from 'luxon';
import { TodoList } from 'src/app/common/models';

export function transformTodoListDTO(todoListDto: any): TodoList {
    return new TodoList(
        todoListDto.id,
        todoListDto.name,
        todoListDto.description,
        DateTime.fromISO(todoListDto.createdAt),
        DateTime.fromISO(todoListDto.modifiedAt),
        todoListDto.deletedAt ? DateTime.fromISO(todoListDto.deletedAt) : null,
        todoListDto.color
    );
  }