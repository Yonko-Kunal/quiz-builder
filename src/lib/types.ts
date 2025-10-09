export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
    createdAt: Date;
    updatedAt: Date;
    timeLimit?: number; // in minutes
}

export interface QuizAttempt {
    id: string;
    quizId: string;
    score: number;
    totalQuestions: number;
    answers: number[];
    completedAt: Date;
}