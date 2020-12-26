import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('fform') commentsFormDirective;

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
    this.dishService.getDishIds().subscribe(ids => this.dishIds = ids);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => {
      this.dish = dish;
      this.setPrevNext(dish.id);
    });
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
    this.dish.comments.push(this.comment);
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
