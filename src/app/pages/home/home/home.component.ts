import { Component } from '@angular/core';
import { StackServiceService } from '../../../services/stack-service.service';
import { CardServiceService } from '../../../services/card-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  stacks: any[] = [];
  cards: any[] = [];

  showAddForm: boolean = false;
  showEditForm: boolean = false;
  newStackName: string = '';
  editedStackName: string = '';
  editingStackId: number | null = 0;

  constructor(
    private stackService: StackServiceService, 
    private cardService: CardServiceService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadStacks();
  }

  loadStacks(): void {
    this.stackService.getStacks().subscribe({
      next: (data) => {
        this.stacks = data;
      },
      error: (error) => {
        console.error('Error updating stack:', error);
        alert('加载 Stack 数据失败，请稍后再试。');
      }
    })
  }

  onNewStackClick(): void {
    if (this.newStackName) {
      this.stackService.createStack(this.newStackName).subscribe({
        next: (res) => {
          this.stacks = res.stack;
          console.log('更新后的 Stack 列表:', this.stacks);
        },
        error: (error) => {
          console.error('Error creating stack:', error);
          // 提供错误反馈
          alert('创建 Stack 失败，请稍后再试。');
        }
      });         
    } else {
      alert('请输入 Stack 名称');
    }
  }

  goToCardList(stackId: number): void {
    if (stackId !== undefined && stackId !== null) {
      this.cardService.getCardsByStack(stackId).subscribe({
        next: (res) => {
          console.log('Received cards:', res);
          this.cardService.setData({
            stackId: stackId,
            cards: res
          });
          this.router.navigate(['/cards', stackId]);
        },
        error: (err) => {
          console.error('获取卡片失败：', err);
        }
      });
    }
  } 

  onEditStackInit(stackId: number): void {
    this.showAddForm = false;
    this.showEditForm = true;
    this.editingStackId = stackId;
  }

  onEditStackClick(stackName: string, stackId: number | null) {
    if (stackId == null) {
      alert('Stack 名称或 ID 无效');
      return;
    } 
    this.stackService.updateStack(stackName, stackId).subscribe({
      next: (data) => {
        this.stacks = data.stack;
        console.log('edit buttom been clicked');
        this.showEditForm = false;
      },
      error: (error) => {
        console.error('Error updating stack:', error);
        alert('更新 Stack 失败，请稍后再试。');
      }
    })
  }

  deleteStack(stack: any): void {
    this.stackService.deleteStack(stack).subscribe({
      next: (data) => {
        this.stacks = data.stack;
      },
      error: (error) => {
        console.error('Error deleting stack:', error);
        alert('删除 Stack 失败，请稍后再试。');
      }
    });
  }

  onInputModeClick(): void{
    this.router.navigate(['learn/input']);
  }

  onChoiceModeClick(): void{
    this.router.navigate(['learn/choice']);
  }
}
