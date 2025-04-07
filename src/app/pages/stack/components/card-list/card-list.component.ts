import { Component, OnInit } from '@angular/core';
import { CardServiceService } from '../../../../services/card-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {FormControl, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { Subscriber } from 'rxjs';
import { Card } from '../../../../../models/card';
import { CardDto } from '../../../../../models/cardDto';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent implements OnInit {
  cards: any[] = [];
  rootStackId: number = 0;

  showForm: boolean = false;

  editingCard: any = null;

  form!: FormGroup;

  constructor(
    private cardService: CardServiceService, 
    private router: Router,
    private fb: FormBuilder
  ){
    this.form = this.fb.group({
      question: ['', Validators.required],
      answers: this.fb.array([
        this.fb.control(''), 
        this.fb.control(''), 
        this.fb.control(''), 
        this.fb.control('')], 
        Validators.required
      ),
      correctAnswer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStacks();
  }

  loadStacks(): void {
    this.cardService.getData().subscribe({
      next: (data) => {
        this.cards = data.cards;
        this.rootStackId = data.stackId;
      },
      error: (err) => this.handleError(err, '获取 Stack 失败，请稍后再试。')
    })
  }
  
  onEditCardInit(cardToEdit: Card) {
    this.showForm = true;
    this.editingCard = cardToEdit;
    this.initializeForm(cardToEdit);
  }

  onClickDeleteCard(cardId: number) {
    this.cardService.deleteCard(cardId).subscribe({
      next: (res) => {
        this.refreshCardList();
      },
      error: (err) => this.handleError(err, '删除失败，请稍后再试。')
    })

  }

  initializeForm(card?: Card) {
    const answers = card ? card.answers : ['', '', '', ''];
    this.form.setValue({
      question: card ? card.question : '',
      answers: answers,
      correctAnswer: card? card.correctAnswer : ''
    })
  }

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  startEdit(card: any) {
    this.editingCard = card;
    this.initializeForm(card); 
  }
  
  cancelEdit() {
    this.showForm = false;
    this.editingCard = null;
    this.resetForm();
  }
  
  resetForm() {
    this.form.reset({
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: ''
    });
  }

  onSubmit() {
    const payload: Card = this.form.value;
    payload.stackId = this.rootStackId;


    if (this.form.invalid) {  // 检查表单是否无效
      alert('请填写所有必填字段');
      return;
    }

    if (this.editingCard) {
      payload.cardId = this.editingCard.cardId ?? 0,
      this.cardService.updateCard(payload).subscribe({
        next: () => {
          console.log('卡片已更新');
          this.cancelEdit();
          this.refreshCardList();
        },
        error: (err) => this.handleError(err, '更新失败')
      });
    } else {
      this.cardService.createCard(payload).subscribe({
        next: () => {
          console.log('卡片已创建');
          this.resetForm();
          this.refreshCardList();
        },
        error: (err) => this.handleError(err, '创建失败')
      });
    }
  }
  
  refreshCardList(): void {
    this.cardService.getCardsByStack(this.rootStackId).subscribe({
      next: (res) => {
        console.log('Received cards:', res);
        this.cards = res;
      },
      error: (err) => this.handleError(err, '获取 Stack 失败，请稍后再试。')
    });
  }

  onBackClick(): void{
    this.router.navigate(['']);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  handleError(error: any, customMessage: string) {
    console.error(customMessage, error);
    alert(customMessage);
  }

  onChoiceModeClick(): void{
    this.router.navigate(['learn/choice']);
  }
}
