
export class Ingredient {

  private _name: string;
  private _amount: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get amount(): string {
    return this._amount;
  }

  set amount(value: string) {
    this._amount = value;
  }


}
