import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Card } from '../../../../../models/card';
import { CardServiceService } from '../../../../services/card-service.service';
import { Subscription } from 'rxjs';
import { ToastServiceService } from '../../../../services/toast-service.service';
import { FormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Answer } from '../../../../../models/answer';

@Component({
  selector: 'app-card-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent implements OnInit {
  editingCard: any = null;
  form!: FormGroup;
  rootStackId: number = 0;
  bulkCard: string = '';

  @Input() isCardFormVisible : boolean = false;
  @Input() isMultiCardFormVisible : boolean = false;
  @Output() closeCardForm = new EventEmitter<void>();
  @Output() closeMultiCardForm = new EventEmitter<void>();

  private dataSubscription: Subscription | undefined;

  constructor (
    private cardService: CardServiceService, 
    private toastService: ToastServiceService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answers: this.fb.array([
        this.createAnswerGroup(), 
        this.createAnswerGroup(), 
        this.createAnswerGroup(), 
        this.createAnswerGroup()], 
        [Validators.required, this.oneCorrectAnswerValidator()]
      ),
    });
  }

  ngOnInit(): void {
    this.dataSubscription = this.cardService.dataList$.subscribe(data => {
      this.rootStackId = data.stackId;
    });

    this.dataSubscription = this.cardService.editingCard$.subscribe(data => {
      this.editingCard = data;
      console.log('find editing data is',data);
    });
    
    this.initializeEditForm(this.editingCard);

    this.getAnswersFormArray().controls.forEach((answerGroup: AbstractControl, index: number) => {
      const isCorrectControl = answerGroup.get('isCorrect');
      if (isCorrectControl) {
        isCorrectControl.valueChanges.subscribe(isCorrect => {
          if (isCorrect) {
            this.markOnlyOneCorrect(index);
          }
        });
      }
    });
  }

  createAnswerGroup(): FormGroup {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: [false]
    });
  }

  getAnswersFormArray(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  oneCorrectAnswerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const answersArray = control as FormArray;
      if (!answersArray || answersArray.length === 0) {
        return null; // 如果数组为空，不报错（但 Validators.required 会处理）
      }

      const correctCount = answersArray.controls.filter(
        (group: AbstractControl) => group.get('isCorrect')?.value === true
      ).length;

      // 如果正确答案数量不为1，则返回错误
      return correctCount === 1 ? null : { 'oneCorrectAnswerRequired': true };
    };
  }

  markOnlyOneCorrect(currentIndex: number): void {
    const answersArray = this.getAnswersFormArray();
    answersArray.controls.forEach((answerGroup: AbstractControl, index: number) => {
      if (index !== currentIndex) {
        answerGroup.get('isCorrect')?.patchValue(false, { emitEvent: false }); // { emitEvent: false } 避免循环触发 valueChanges
      }
    });
  }

  initializeEditForm(card?: Card) {
    console.log({card});
    const answersArray = this.fb.array(
      (card && card.answers ? card.answers : [
        {answerText:'', isCorrect:false}, 
        {answerText:'', isCorrect:false}, 
        {answerText:'', isCorrect:false}, 
        {answerText:'', isCorrect:false}
      ]).map(a => this.fb.group({
          answerText: [a.answerText],
          isCorrect: [a.isCorrect]
        })), Validators.required
    );
  
    this.form.setControl('answers', answersArray);
  
    this.form.patchValue({
      question: card?.question || '', 
    });
  }

  // get answers(): FormArray {
  //   return this.form.get('answers') as FormArray;
  // }

  // trackByIndex(index: number): number {
  //   return index;
  // }

  onCloseCardForm() {
    this.closeCardForm.emit();
    if (this.editingCard)
    {
      this.cardService.setEditingCard(null);
    }
  }

  onCloseMultiCardForm() {
    this.closeMultiCardForm.emit();
  }

  onSubmit() {
    const payload: Card = this.form.value;
    payload.stackId = this.rootStackId;

    if (this.form.invalid) {  
      this.toastService.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    if (this.editingCard) {
      this.editCard(payload);
      this.cardService.setEditingCard(null);
    } else {
      this.addNewCard(payload);
    }
  }

  editCard(card: Card) {
    const editRequest = {
      question: card.question, 
      answers: card.answers, 
      stackId: card.stackId,
      cardId: this.editingCard.cardId
    };

    this.cardService.updateCard(editRequest).subscribe({
      next: () => {
        this.closeCardForm.emit();
        this.refrechCardList();
      },
      error: (error) => this.handleError(error, 'Update failed.')
    });
  }

  addNewCard(card: Card) {
    const addRequest = {
      question: card.question, 
      answers: card.answers, 
      stackId: card.stackId,
      cardId: 0
    };

    this.cardService.createCard(addRequest).subscribe({
      next: () => {
        this.closeCardForm.emit();
        this.refrechCardList();
      },
      error: (error) => this.handleError(error, 'Creation failed.')
    });
  }

  refrechCardList(): void {
    this.cardService.getCardsByStack(this.rootStackId).subscribe({
      next: (data) => {
        this.cardService.setData({
          stackId: this.rootStackId,
          cards: data
        });
      },
      error: (error) => this.handleError(error, 'Failed to fetch cards. Please try again later.')
    });
  }

  importBulkCards() {
    if (!this.bulkCard.trim()) {
      this.toastService.showToast('Please entre the cards that you want to add', 'warning');
      return;
    }

    const lines = this.bulkCard.trim().split('\n');
    const newCards = lines.map(line => {
    const [question, correctAnswer, options] = line.split('|').map(s => s.trim());

    const answers = options
      ? options.split(',').map(o => {
          const [answerText, isCorrectStr] = o.trim().split(' ');
          return {
            answerText: answerText.trim(),
            isCorrect: isCorrectStr === 'true'
          };
        })
      : [];

    return {
      question,
      correctAnswer,
      answers,
      stackId: this.rootStackId,
      cardId: 0
    };
  });

    this.cardService.createMultiCard(newCards).subscribe({
      next: () => {
        this.closeMultiCardForm.emit();
        this.refrechCardList();
      },
      error: (error) => this.handleError(error, 'Creation failed.')
    });

    this.bulkCard = '';

    this.toastService.showToast('Import sucesses', 'success');
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }
}
