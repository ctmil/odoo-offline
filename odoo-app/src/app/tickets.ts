

export class Tickets {
    id: number;
    date: Date;
    amount: number = 0;
    client: string = '';
    complete: boolean = false;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
