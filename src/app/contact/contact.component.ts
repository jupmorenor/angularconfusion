import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { flyInOut, visibility, expand } from '../animations/app.animations';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackError: string;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  visibility: string = 'hidden';
  sent: boolean = false;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be longer',
      'maxlength': 'First name is too long'
    },
    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must be longer',
      'maxlength': 'Last name is too long'
    },
    'telnum' : {
      'required': 'Phone number is required',
      'pattern': 'Only numbers allowed'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email has not the correct format'
    }

  }

  constructor(
    private builder: FormBuilder,
    private feedbackService: FeedbackService,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.builder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe( data => this.onValueChanged(data))
  }

  onValueChanged(data){
    if (!this.feedbackForm) { return; }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = this.feedbackForm.get(field);
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

  onSubmit() {
    this.visibility = 'shown';
    this.sent = true;
    this.feedback = null;
    this.feedbackError = null;
    this.feedbackService.submitFeedback(<Feedback>this.feedbackForm.value).subscribe(
      (response: Feedback) => {
        this.feedback = response;
        this.sent = false; 
        setTimeout(() => this.feedback = null, 5000)
      },
      (error: any) => {
        this.feedbackError = error;
        this.sent = false;
        setTimeout(() => this.feedbackError = null, 5000)
      },
    )
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm()
  }

}
