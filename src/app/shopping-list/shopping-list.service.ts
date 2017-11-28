import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ShoppingListService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private serverUrl = environment.serverUrl + '/ingredients'; // URL to web api
  private ingredients: Ingredient[];

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  constructor(private http: Http) {
    this.getIngredients();
  }

  public getIngredients(): Promise<Ingredient[]> {
    console.log('ingredients ophalen van server');
    return this.http.get(this.serverUrl, {headers: this.headers})
      .toPromise()
      .then(response => {
        this.ingredients = response.json() as Ingredient[];
        return response.json() as Ingredient[];
      })
      .catch(error => {
        return this.handleError(error);
      });
  }


  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) : Promise<Ingredient> {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());

    console.log('Ingredient toevoegen: ' + ingredient.name);
    return this.http.post(this.serverUrl,
      {
        name: ingredient.name,
        amount: ingredient.amount,
        headers: this.headers
      })
      .toPromise()
      .then(response => {
        return response.json() as Ingredient;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  addIngredients(ingredients: Ingredient[]) {
    for (const ingredient of ingredients) {
      this.addIngredient(ingredient);
    }
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    newIngredient._id = this.ingredients[index]._id;

    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());

    console.log('Ingredient updaten: ' + newIngredient.name);
    return this.http.put(this.serverUrl + '/' + newIngredient._id, {
      name: newIngredient.name,
      amount: newIngredient.amount,
      headers: this.headers})
      .toPromise()
      .then(response => {
        return response.json() as Ingredient;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  deleteIngredient(index: number) {
    const ingredientToDelete = this.ingredients[index];

    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());

    console.log('Ingredient verwijderen: ' + ingredientToDelete.name);
    return this.http.delete(this.serverUrl + '/' + ingredientToDelete._id)
      .toPromise()
      .then(response => {
        return response.json() as Ingredient;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  private handleError(error: any): Promise<any> {
    console.log('handleError');
    return Promise.reject(error.message || error);
  }
}
