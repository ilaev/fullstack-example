import { TodoListDto } from './../../api';
import { DateTime } from 'luxon';
import { TodoList } from 'src/app/common/models';

export function transformFromTodoListDTO(todoListDto: TodoListDto): TodoList {
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

export function transformToTodoListDTO(list: TodoList): TodoListDto {
    // TODO: 
    // consider ONLY including relavant properties in the DTO for UPDATIONS, CREATIONS, DELETIONS
    // i.e. client can't change certain values, so doesn't have to send them to the backend. 
    return {
        id: list.id,
        name: list.name,
        description: list.description,
        createdAt: list.createdAt.toUTC().toJSON(),
        modifiedAt: list.modifiedAt.toUTC().toJSON(),
        deletedAt: list.deletedAt ? list.deletedAt.toUTC().toJSON() : null,
        color: list.color
    };
}