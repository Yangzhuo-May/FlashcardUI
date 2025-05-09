import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { loginRequest } from '../../../../models/loginRequest';

@Component({
  selector: 'app-login',
  imports: [ 
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService
  ){
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit() { 
    const payload : loginRequest = {
      email : this.form.value.email,
      password : this.form.value.password
    };

    if (this.form.invalid) {  
      alert('Please fill in all required fields.');
      return;
    }

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.authService.loginSuccess(res.token);
      },
      error: (error) => this.handleError(error, 'Register failed.')
    });
  }

  private handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    if (error?.error?.errors) {
      console.error('Validation errors from backend:', error.error.errors);
      let detailedErrorMessage = '';
      for (const field in error.error.errors) {
        if (error.error.errors.hasOwnProperty(field)) {
          detailedErrorMessage += `${field}: ${error.error.errors[field].join(', ')}\n`;
        }
      }
      alert(`${customMessage}\nDetails:\n${detailedErrorMessage}`);
    } else if (error?.error?.title) {
      alert(`${customMessage}\nDetails: ${error.error.title}`);
    } else {
      alert(`${customMessage}\nDetails: ${error.message}`);
    }
  }
}

