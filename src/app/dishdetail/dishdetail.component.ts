import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishCopy: Dish;
  dishIds: string[];
  errorMessage: string;
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('fform') commentsFormDirective;

  visibility: string = 'shown';

  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  }

  validationMessages = {
    'author': {
      'required': 'Comment author name is required',
      'minlength': 'Author name must have more than 1 character'
    },
    'comment': {
      'required': 'Your comment is required'
    },
  }

  constructor(
    private dishService: DishService, 
    private location: Location, 
    private route: ActivatedRoute,
    private builder: FormBuilder,
    @Inject('BaseURL') private BaseURL,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(
      ids => this.dishIds = ids,
      error => this.errorMessage = error,
    );
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.dishService.getDish(params['id'])
    }))
    .subscribe(dish => {
      this.dish = dish;
      this.dishCopy = dish;
      this.setPrevNext(dish.id);
      this.visibility = 'shown';
    },
    (error: any) => this.errorMessage = error );
  }

  createForm() {
    this.commentForm = this.builder.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ['', Validators.required]
    });

    this.commentForm.valueChanges.subscribe( data => this.onValueChanged(data));
  }

  sendComment() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy).subscribe(
      (dish: Dish) => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      (error: any) => {
        this.dish = null;
        this.dishCopy = null;
        this.errorMessage = error;
      }
    )
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    this.commentsFormDirective.resetForm()
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

  onValueChanged(data){
    if (!this.commentForm) { return; }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = this.commentForm.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] = messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
