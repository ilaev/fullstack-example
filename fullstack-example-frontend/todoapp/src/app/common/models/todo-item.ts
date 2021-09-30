import { MatrixY } from './matrix-y';
import { MatrixX } from './matrix-x';
import { isDateEqual } from '../date-utility';
import { DateTime } from 'luxon';

export class TodoItem {
    public id: string;
    public listId: string | null;
    public name: string;
    public matrixX: MatrixX;
    public matrixY: MatrixY;
    public note: string;
    public dueDate: DateTime | null;
    public createdAt: DateTime;
    public modifiedAt: DateTime;
    public deletedAt: DateTime | null;
    public markedAsDone: boolean;

    constructor(
        id: string,
        listId: string | null,
        name: string,
        matrixX: MatrixX,
        matrixY: MatrixY,
        note: string,
        dueDate: DateTime | null,
        createdAt: DateTime,
        modifiedAt: DateTime,
        deletedAt: DateTime | null,
        markedAsDone: boolean
    ) {
        this.id = id;
        this.listId = listId;
        this.name = name;
        this.matrixX = matrixX;
        this.matrixY = matrixY;
        this.note = note;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.deletedAt = deletedAt;
        this.markedAsDone = markedAsDone;
    }

    public equals(other: TodoItem): boolean {
        return this.id === other.id &&
        this.listId === other.listId &&
        this.name === other.name &&
        this.matrixX === other.matrixX &&
        this.matrixY === other.matrixY &&
        this.note === other.note &&
        isDateEqual(this.dueDate, other.dueDate) &&
        isDateEqual(this.createdAt, other.createdAt) &&
        isDateEqual(this.modifiedAt, other.modifiedAt) &&
        isDateEqual(this.deletedAt, other.deletedAt) &&
        this.markedAsDone === other.markedAsDone;
    }
}
