export class Cliente {
    id: number;
    name: string;
    phone: string;
    email: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
