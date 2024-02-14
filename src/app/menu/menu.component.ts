import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    flyInOut(),
    expand(),
  ],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errorMessage: string;

  selectedDish: Dish;

  constructor(
    private dishService: DishService,
    @Inject('BaseURL') protected BaseURL,  
  ) { }

  ngOnInit(): void {
    this.dishService.getDishes().subscribe(
      dishes => this.dishes = dishes,
      error => this.errorMessage = <any>error,
    );   
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

}
