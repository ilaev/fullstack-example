export class TodoViewListItem {
    public name: string;
    public id: string;
    public isDone: boolean;
    public listName: string;
    public listColor: string;
    public dueDate: string;

    constructor(
        name: string,
        id: string,
        isDone: boolean,
        listName: string,
        listColor: string,
        dueDate: string
    ) {
        this.name = name;
        this.id = id;
        this.isDone = isDone;
        this.listName = listName;
        this.listColor = listColor;
        this.dueDate = dueDate;
    }
}