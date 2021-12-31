export class TodoStats {
    public numberOfItemsMarkedAsDone: number;
    public numberOfItems: number;

    public get numberOfItemsMarkedAsDonePercentage(): number {
        if (this.numberOfItems !== 0) {
            return this.numberOfItemsMarkedAsDone / this.numberOfItems * 100;
        }
        return 0;
    }

    constructor(numberOfItemsMarkedAsDone: number, numberOfItems: number) {
        this.numberOfItemsMarkedAsDone = numberOfItemsMarkedAsDone;
        this.numberOfItems = numberOfItems;
    }
}