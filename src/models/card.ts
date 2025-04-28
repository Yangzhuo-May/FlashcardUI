export interface Card {
    cardId?: number;
    question: string;         
    answers: string[];       
    correctAnswer: string;  
    stackId: number;        
  }