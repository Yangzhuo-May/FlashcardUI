import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../services/auth-service.service';
import { registerRequestDto } from '../../../../models/registerRequestDto';
import { ToastServiceService } from '../../../services/toast-service.service';

@Component({
  selector: 'app-register',
  imports: [ 
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private toastService: ToastServiceService
  ){
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit() { 
    const payload : registerRequestDto = {
      username : this.form.value.userName,
      email : this.form.value.email,
      password : this.form.value.password,
      confirmPassword : this.form.value.confirmPassword
    };

    if (this.form.invalid) {  
      alert('Please fill in all required fields.');
      return;
    }

    console.log(this.form.value);
    this.authService.register(payload).subscribe({
      next: () => {
        this.toastService.showToast('Register succesful!');
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
