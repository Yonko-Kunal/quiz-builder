"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play, Trash2 } from "lucide-react";
import { Quiz } from "@/lib/types";
import { QuizStorage } from "@/lib/storage";
import Navbar from "@/components/navbar";
import Link from "next/link";

// Dummy data
const dummyQuizzes: Quiz[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    questions: [
      {
        id: "q1",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
      },
      {
        id: "q2",
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "2",
    title: "History Quiz",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    questions: [
      {
        id: "q3",
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1
      },
      {
        id: "q4",
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "3",
    title: "Science Quiz",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    questions: [
      {
        id: "q5",
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2
      },
      {
        id: "q6",
        question: "How many bones are in the adult human body?",
        options: ["206", "208", "210", "212"],
        correctAnswer: 0
      }
    ]
  }
];

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    // Load quizzes from localStorage or use dummy data
    const savedQuizzes = QuizStorage.getQuizzes();
    if (savedQuizzes.length > 0) {
      setQuizzes(savedQuizzes);
    } else {
      setQuizzes(dummyQuizzes);
      QuizStorage.saveQuizzes(dummyQuizzes);
    }
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Updated 1 day ago";
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 14) return "Updated 1 week ago";
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
    return `Created ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const handleDeleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    setQuizzes(updatedQuizzes);
    QuizStorage.saveQuizzes(updatedQuizzes);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">My Quizzes</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create, edit, and manage your quizzes</p>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-md">
              <CardHeader className="pb-3 p-4 sm:p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg font-semibold text-foreground mb-1 leading-tight">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      {quiz.questions.length} Question{quiz.questions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formatDate(quiz.updatedAt)}
                </div>
              </CardHeader>
              <CardContent className="pt-0 p-4 sm:p-5">
                <div className="flex justify-start items-center">
                  <div className="flex space-x-1 sm:space-x-2">
                    <Link href={`/quiz/${quiz.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">No quizzes yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Get started by creating your first quiz</p>
            <Link href="/create">
              <Button className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
