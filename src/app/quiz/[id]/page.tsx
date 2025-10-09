"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Clock, X, Menu } from "lucide-react";
import { Quiz, QuizAttempt } from "@/lib/types";
import { QuizStorage } from "@/lib/storage";

export default function QuizPlayer() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.id as string;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
    const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    useEffect(() => {
        // Load quiz data
        const quizzes = QuizStorage.getQuizzes();
        const foundQuiz = quizzes.find(q => q.id === quizId);

        if (!foundQuiz) {
            router.push("/");
            return;
        }

        setQuiz(foundQuiz);
        setSelectedAnswers(new Array(foundQuiz.questions.length).fill(-1));
        setMarkedForReview(new Array(foundQuiz.questions.length).fill(false));
        setShowSubmitDialog(false); // Ensure dialog is closed initially

        // Mark first question as visited
        const initialVisited = new Array(foundQuiz.questions.length).fill(false);
        initialVisited[0] = true;
        setVisitedQuestions(initialVisited);

        // Set timer (default to 30 minutes if no time limit set)
        const timeInMinutes = foundQuiz.timeLimit || 30;
        setTimeRemaining(timeInMinutes * 60);
    }, [quizId, router]);

    useEffect(() => {
        // Timer countdown
        if (timeRemaining > 0 && !isQuizCompleted) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && !isQuizCompleted) {
            // Time's up - auto submit without dialog
            confirmSubmitQuiz();
        }
    }, [timeRemaining, isQuizCompleted]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        // If clicking the same answer that's already selected, deselect it
        if (newAnswers[currentQuestionIndex] === answerIndex) {
            newAnswers[currentQuestionIndex] = -1; // -1 means no answer selected
        } else {
            newAnswers[currentQuestionIndex] = answerIndex;
        }
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        // Mark current question as visited
        const newVisited = [...visitedQuestions];
        newVisited[currentQuestionIndex] = true;
        setVisitedQuestions(newVisited);

        // Only navigate to next question, never auto-submit
        if (currentQuestionIndex < quiz!.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        // If it's the last question, do nothing - user must click Submit
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleMarkForReview = () => {
        const newMarked = [...markedForReview];
        newMarked[currentQuestionIndex] = !newMarked[currentQuestionIndex];
        setMarkedForReview(newMarked);

        // Navigate to next question after marking for review (but not if it's the last question)
        setTimeout(() => {
            if (currentQuestionIndex < quiz!.questions.length - 1) {
                // Mark current question as visited
                const newVisited = [...visitedQuestions];
                newVisited[currentQuestionIndex] = true;
                setVisitedQuestions(newVisited);

                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 100); // Small delay to show the marking action
    };

    const jumpToQuestion = (questionIndex: number) => {
        // Mark current question as visited before jumping
        const newVisited = [...visitedQuestions];
        newVisited[currentQuestionIndex] = true;
        setVisitedQuestions(newVisited);

        setCurrentQuestionIndex(questionIndex);
    };

    const getQuestionStatus = (index: number) => {
        const isAnswered = selectedAnswers[index] !== -1;
        const isMarked = markedForReview[index];
        const isVisited = visitedQuestions[index] || index === currentQuestionIndex;

        if (isAnswered && isMarked) return "answered-marked";
        if (isAnswered) return "answered";
        if (isMarked) return "marked";
        if (isVisited) return "skipped";
        return "unvisited";
    };

    const getQuestionColor = (status: string) => {
        switch (status) {
            case "answered": return "bg-green-500 text-white";
            case "answered-marked": return "bg-purple-500 text-white relative";
            case "skipped": return "bg-red-500 text-white";
            case "marked": return "bg-purple-500 text-white";
            case "unvisited": return "bg-muted text-muted-foreground";
            default: return "bg-muted text-muted-foreground";
        }
    };



    const handleSubmitQuiz = () => {
        // Only show dialog when user explicitly clicks submit button
        setShowSubmitDialog(true);
    };

    const confirmSubmitQuiz = () => {
        if (!quiz) return;

        // Calculate score
        let correctAnswers = 0;
        quiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const finalScore = correctAnswers;
        setScore(finalScore);
        setIsQuizCompleted(true);

        // Save attempt to storage
        const attempt: QuizAttempt = {
            id: QuizStorage.generateId(),
            quizId: quiz.id,
            score: finalScore,
            totalQuestions: quiz.questions.length,
            answers: selectedAnswers,
            completedAt: new Date()
        };

        QuizStorage.saveAttempt(attempt);
        setShowSubmitDialog(false);
    };

    const handleExit = () => {
        if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
            router.push("/");
        }
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    if (isQuizCompleted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-2xl mx-4">
                    <CardContent className="p-8 text-center">
                        <h1 className="text-3xl font-bold text-foreground mb-4">Quiz Completed!</h1>
                        <div className="text-6xl font-bold text-blue-600 mb-4">
                            {score}/{quiz.questions.length}
                        </div>
                        <p className="text-xl text-muted-foreground mb-8">
                            You scored {Math.round((score / quiz.questions.length) * 100)}%
                        </p>

                        <div className="space-y-4 mb-8">
                            <h3 className="text-lg font-semibold text-foreground">Review:</h3>
                            {quiz.questions.map((question, index) => (
                                <div key={index} className="text-left p-4 bg-muted rounded-lg">
                                    <p className="font-medium mb-2 text-foreground">{question.question}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Your answer: {selectedAnswers[index] >= 0 ? question.options[selectedAnswers[index]] : "Not answered"}
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        Correct answer: {question.options[question.correctAnswer]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
                            Back to My Quizzes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-background border-b border-border px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg sm:text-xl font-semibold text-foreground">Quiz Player</h1>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="font-mono text-base sm:text-lg">{formatTime(timeRemaining)}</span>
                        </div>

                        {/* Question Matrix Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Menu className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 sm:w-80 p-3 sm:p-4" align="end">
                                <div className="space-y-3 sm:space-y-4">
                                    <h3 className="font-semibold text-foreground text-sm sm:text-base">Question Matrix</h3>

                                    {/* Question Grid */}
                                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                                        {quiz.questions.map((_, index) => {
                                            const status = getQuestionStatus(index);
                                            const colorClass = getQuestionColor(status);
                                            const isAnsweredAndMarked = status === "answered-marked";

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => jumpToQuestion(index)}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded text-xs sm:text-sm font-medium transition-colors ${colorClass} ${index === currentQuestionIndex ? "ring-2 ring-blue-400" : ""
                                                        }`}
                                                >
                                                    {index + 1}
                                                    {isAnsweredAndMarked && (
                                                        <div className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full border border-white transform translate-x-1 -translate-y-1"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Legend */}
                                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                                            <span>Answered</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
                                            <span>Skipped</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded"></div>
                                            <span>Marked for Review</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="relative w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded">
                                                <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full border border-white transform translate-x-0.5 -translate-y-0.5"></div>
                                            </div>
                                            <span>Answered + Marked</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded"></div>
                                            <span>Not Visited</span>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExit}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full px-4 sm:px-6 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Section */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <span className="text-xs sm:text-sm text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                                Score: {score}
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* Question Card */}
                    <Card className="mb-6 sm:mb-8">
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-6 sm:mb-8 text-center leading-tight">
                                {currentQuestion.question}
                            </h2>

                            <div className="space-y-3 sm:space-y-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full p-3 sm:p-4 text-left border-2 rounded-lg transition-all ${selectedAnswers[currentQuestionIndex] === index
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                            : "border-border hover:border-muted-foreground bg-card"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div
                                                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedAnswers[currentQuestionIndex] === index
                                                    ? "border-blue-500 bg-blue-500"
                                                    : "border-muted-foreground"
                                                    }`}
                                            />
                                            <span className="text-sm sm:text-base lg:text-lg text-foreground">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="w-full sm:w-auto px-4 sm:px-6"
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleMarkForReview}
                            className={`w-full sm:w-auto px-4 sm:px-6 ${markedForReview[currentQuestionIndex]
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-yellow-500 text-white hover:bg-yellow-600"
                                }`}
                        >
                            <span className="hidden sm:inline">Mark for Review</span>
                            <span className="sm:hidden">Mark Review</span>
                        </Button>

                        {currentQuestionIndex === quiz.questions.length - 1 ? (
                            <Button
                                onClick={handleSubmitQuiz}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 sm:px-6"
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 sm:px-6"
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </main>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Quiz</AlertDialogTitle>
                        <AlertDialogDescription>
                            {(() => {
                                const unansweredCount = selectedAnswers.filter(answer => answer === -1).length;
                                if (unansweredCount > 0) {
                                    return `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Do you want to submit the quiz?`;
                                }
                                return "Do you want to submit the quiz? This action cannot be undone.";
                            })()}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                            Yes, Submit Quiz
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}