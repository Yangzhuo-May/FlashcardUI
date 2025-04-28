export interface CardDto {
    question: string;         
    answers: string[];       
    correctAnswer: string; 
    stackId?: number;
    cardId?: number;      
  }