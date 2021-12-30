export class TodoQuadrantItem {
    public id: string;
    public name: string;
    public description: string;
    public markedAsDone: boolean;

    constructor(
        id: string,
        name: string,
        description: string,
        markedAsDone: boolean
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.markedAsDone = markedAsDone;
    }
}