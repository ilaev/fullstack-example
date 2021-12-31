export class TodoViewListItem {
    public name: string;
    public id: string;
    public listName: string;
    public listColor: string;
    public dueDate: string;

    constructor(
        name: string,
        id: string,
        listName: string,
        listColor: string,
        dueDate: string
    ) {
        this.name = name;
        this.id = id;
        this.listName = listName;
        this.listColor = listColor;
        this.dueDate = dueDate;
    }
}