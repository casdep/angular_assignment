import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public _id: string;
  public name: string;
  public description: string;
  public imageURL: string;
  public ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.imageURL = imagePath;
    this.ingredients = ingredients;
  }
}
