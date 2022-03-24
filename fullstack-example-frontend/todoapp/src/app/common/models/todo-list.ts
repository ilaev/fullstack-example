import { DateTime } from "luxon";
import { isDateEqual } from "../date-utility";

export class TodoList {
    public static defaultListId = '00000000-0000-0000-0000-111111000000';
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly createdAt: DateTime;
    public readonly modifiedAt: DateTime
    public readonly deletedAt: DateTime | null;
    public readonly color: string;

    constructor(
        id: string,
        name: string,
        description: string,
        createdAt: DateTime,
        modifiedAt: DateTime, 
        deletedAt: DateTime | null,
        color: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.deletedAt = deletedAt;
        this.color = color;
    }

    public equals(otherList: TodoList): boolean {
        return this.id === otherList.id &&
        this.color === otherList.color &&
        this.name === otherList.name &&
        this.description === otherList.description &&
        isDateEqual(this.createdAt, otherList.createdAt) &&
        isDateEqual(this.modifiedAt, otherList.modifiedAt) &&
        isDateEqual(this.deletedAt, otherList.deletedAt);
    }
}

