import { Answer } from "./answer";

export interface Card {
    cardId?: number;
    question: string;         
    answers: Answer[];       
    stackId: number;        
  }