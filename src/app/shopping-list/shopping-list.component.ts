import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent {

  ingredients: Ingredient[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ingredientService: ShoppingListService
  ) { }


  // constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredientService.getIngredients()
      .then(ingredients => this.ingredients = ingredients)
      .catch(error => console.log(error));
  }
}
