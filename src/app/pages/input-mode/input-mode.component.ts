import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardDto } from '../../../models/cardDto';
import { CardServiceService } from '../../services/card-service.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { ScoreServiceService } from '../../services/score-service.service';
import { ScoreDisplayComponent } from '../../shared/score-display/score-display.component';

@Component({
  selector: 'app-input-mode',
  imports: [
    BackButtonComponent,
    ScoreDisplayComponent, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './input-mode.component.html',
  styleUrl: './input-mode.component.css'
})
export class InputModeComponent implements OnInit {

  @Input()  answers: string[] = ['', '', '', ''];
  @Output() triggerCheck = new EventEmitter<string>();
  form!: FormGroup;
  
  inputTouched: boolean = false;

  constructor(
    private cardService: CardServiceService,
    private scoreService: ScoreServiceService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      userAnswer: [{ value: '', disabled: true } , Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.get('userAnswer')?.enable();
  }

  resetFormState(): void {
    this.form.reset();     
    this.inputTouched = false;
  }
  
  inputedAnswer() {
    const userAnswer = this.form.get('userAnswer')?.value?.trim().toLowerCase();
    this.triggerCheck.emit(userAnswer);
    this.resetFormState();
  }

  onInputFocus() {
    this.inputTouched = true;
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
