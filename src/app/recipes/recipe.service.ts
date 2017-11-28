import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import {environment} from '../../environments/environment.prod';
import {Http} from '@angular/http';
import {Headers} from '@angular/http';

@Injectable()
export class RecipeService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private serverUrl = environment.serverUrl + '/recipes'; // URL to web api
  private recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();

  constructor(private slService: ShoppingListService, private http: Http) {}

  public getRecipes(): Promise<Recipe[]> {
    console.log('recipes ophalen van server');
    return this.http.get(this.serverUrl, {headers: this.headers})
      .toPromise()
      .then(response => {
        console.dir(response.json());
        this.recipes = response.json() as Recipe[];
        return response.json() as Recipe[];
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) : Promise<Recipe> {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());

    console.log('Recipe toevoegen: ' + recipe.name);
    return this.http.post(this.serverUrl,
      {
        name: recipe.name,
        imageURL: recipe.imageURL,
        ingredients: recipe.ingredients,
        description: recipe.description,
        headers: this.headers
      })
      .toPromise()
      .then(response => {
        console.log(response.json() as Recipe);
        return response.json() as Recipe;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  updateRecipe(index: number, newRecipe: Recipe) : Promise<Recipe> {
    newRecipe._id = this.recipes[index]._id;

    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());

    console.log('Recipe updaten: ' + newRecipe.name);
    return this.http.put(this.serverUrl + '/' + newRecipe._id, {
      name: newRecipe.name,
      imageURL: newRecipe.imageURL,
      ingredients: newRecipe.ingredients,
      headers: this.headers})
      .toPromise()
      .then(response => {
        return response.json() as Recipe;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  private handleError(error: any): Promise<any> {
    console.log('handleError');
    return Promise.reject(error.message || error);
  }
}
