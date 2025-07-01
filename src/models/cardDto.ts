import { Answer } from "./answer";

export interface CardDto {
    question: string;         
    answers: Answer[];       
    stackId?: number;
    cardId?: number;      
}