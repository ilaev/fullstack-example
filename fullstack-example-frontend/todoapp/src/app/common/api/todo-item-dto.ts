export interface TodoItemDto {
    id: string;
    listId: string;
    name: string;
    matrixX: number;
    matrixY: number;
    note: string;
    dueDate: string | null;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
    markedAsDone: boolean;
}