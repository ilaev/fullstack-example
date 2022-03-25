import { DateTime } from 'luxon';
import { TodoItem, MatrixX, MatrixY } from 'src/app/common/models';
import { TodoItemDto } from '../../api';

export function transformFromTodoItemDTO(todoItemDto: TodoItemDto): TodoItem {
    return new TodoItem(
        todoItemDto.id,
        todoItemDto.listId,
        todoItemDto.name,
        todoItemDto.matrixX as MatrixX,
        todoItemDto.matrixY as MatrixY,
        todoItemDto.note,
        todoItemDto.dueDate != null ? DateTime.fromISO(todoItemDto.dueDate) : null,
        DateTime.fromISO(todoItemDto.createdAt),
        DateTime.fromISO(todoItemDto.modifiedAt),
        todoItemDto.deletedAt != null ? DateTime.fromISO(todoItemDto.deletedAt) : null,
        todoItemDto.markedAsDone as boolean
    );
  }

export function transformToTodoItemDTO(item: TodoItem): TodoItemDto {
    const result: TodoItemDto =  {
        id: item.id,
        listId: item.listId ?? '',
        name: item.name,
        matrixX: item.matrixX,
        matrixY: item.matrixY,
        note: item.note,
        dueDate: item.dueDate ? item.dueDate.toUTC().toJSON() : null,
        createdAt: item.createdAt.toUTC().toJSON(),
        modifiedAt: item.modifiedAt.toUTC().toJSON(),
        deletedAt: item.deletedAt ? item.deletedAt.toUTC().toJSON() : null,
        markedAsDone: item.markedAsDone
    };
    return result;
}