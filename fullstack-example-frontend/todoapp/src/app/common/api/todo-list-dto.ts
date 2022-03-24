export interface TodoListDto {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
    color: string;
}