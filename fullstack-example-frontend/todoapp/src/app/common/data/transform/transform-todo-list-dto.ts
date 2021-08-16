import { TodoList } from 'src/app/common/models';

export function transformTodoListDTO(todoListDto: any): TodoList {
    return new TodoList(
        todoListDto.id,
        todoListDto.name,
        todoListDto.description,
        new Date(todoListDto.createdAt),
        new Date(todoListDto.modifiedAt),
        todoListDto.deletedAt ? new Date(todoListDto.deletedAt) : null,
        todoListDto.color
    )
  }