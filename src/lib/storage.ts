import { Quiz, QuizAttempt } from './types';

export const STORAGE_KEYS = {
    QUIZZES: 'quizzes',
    ATTEMPTS: 'quiz-attempts'
} as const;

export class QuizStorage {
    static getQuizzes(): Quiz[] {
        if (typeof window === 'undefined') return [];

        const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return parsed.map((quiz: any) => ({
                ...quiz,
                createdAt: new Date(quiz.createdAt),
                updatedAt: new Date(quiz.updatedAt)
            }));
        } catch {
            return [];
        }
    }

    static saveQuizzes(quizzes: Quiz[]): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    }

    static getAttempts(): QuizAttempt[] {
        if (typeof window === 'undefined') return [];

        const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return parsed.map((attempt: any) => ({
                ...attempt,
                completedAt: new Date(attempt.completedAt)
            }));
        } catch {
            return [];
        }
    }

    static saveAttempt(attempt: QuizAttempt): void {
        if (typeof window === 'undefined') return;

        const attempts = this.getAttempts();
        attempts.push(attempt);
        localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    }

    static generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}