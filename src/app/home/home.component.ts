import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service'
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    flyInOut(),
    expand(),
  ],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  dishError: string;
  promoError: string;
  leaderError: string;

  constructor(
    private dishService: DishService, 
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL: string,
  ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish, err => this.dishError = <any>err);
    this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, err => this.promoError = <any>err);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader, err => this.leaderError = <any>err);
  }

}
