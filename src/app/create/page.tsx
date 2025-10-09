"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { Quiz } from "@/lib/types";
import { QuizStorage } from "@/lib/storage";
import Navbar from "@/components/navbar";

interface QuestionForm {
    question: string;
    options: string[];
    correctAnswer: number;
}

export default function CreateQuiz() {
    const router = useRouter();
    const [quizTitle, setQuizTitle] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    const [questions, setQuestions] = useState<QuestionForm[]>([
        {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0
        }
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0
            }
        ]);
    };

    const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuestions(updatedQuestions);
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const saveQuiz = () => {
        if (!quizTitle.trim()) {
            alert("Please enter a quiz title");
            return;
        }

        const hasEmptyQuestions = questions.some(q =>
            !q.question.trim() || q.options.some(opt => !opt.trim())
        );

        if (hasEmptyQuestions) {
            alert("Please fill in all questions and options");
            return;
        }

        const newQuiz: Quiz = {
            id: QuizStorage.generateId(),
            title: quizTitle,
            createdAt: new Date(),
            updatedAt: new Date(),
            timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
            questions: questions.map((q, index) => ({
                id: `q${index + 1}`,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer
            }))
        };

        const existingQuizzes = QuizStorage.getQuizzes();
        const updatedQuizzes = [...existingQuizzes, newQuiz];
        QuizStorage.saveQuizzes(updatedQuizzes);

        router.push("/");
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Main Content */}
            <main className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/")}
                            className="mb-4 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Quizzes
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create a New Quiz</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">Fill in the details below to build your interactive quiz.</p>
                    </div>

                    {/* Quiz Details */}
                    <Card className="mb-6 sm:mb-8">
                        <CardContent className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <Label htmlFor="quiz-title" className="text-sm font-medium text-foreground mb-2 block">
                                        Quiz Title
                                    </Label>
                                    <Input
                                        id="quiz-title"
                                        placeholder="e.g., General Knowledge Challenge"
                                        value={quizTitle}
                                        onChange={(e) => setQuizTitle(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="time-limit" className="text-sm font-medium text-foreground mb-2 block">
                                        Time Limit (in minutes)
                                    </Label>
                                    <Select value={timeLimit} onValueChange={setTimeLimit}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select time limit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10 minutes</SelectItem>
                                            <SelectItem value="15">15 minutes</SelectItem>
                                            <SelectItem value="20">20 minutes</SelectItem>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="45">45 minutes</SelectItem>
                                            <SelectItem value="60">60 minutes</SelectItem>
                                            <SelectItem value="90">90 minutes</SelectItem>
                                            <SelectItem value="120">120 minutes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions */}
                    {questions.map((question, questionIndex) => (
                        <Card key={questionIndex} className="mb-4 sm:mb-6">
                            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base sm:text-lg font-semibold">
                                        Question {questionIndex + 1}
                                    </CardTitle>
                                    {questions.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeQuestion(questionIndex)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="mb-4 sm:mb-6">
                                    <Input
                                        placeholder="What is the capital of France?"
                                        value={question.question}
                                        onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                                        className="w-full text-sm sm:text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2 sm:space-x-3">
                                            <input
                                                type="radio"
                                                name={`question-${questionIndex}`}
                                                checked={question.correctAnswer === optionIndex}
                                                onChange={() => updateQuestion(questionIndex, "correctAnswer", optionIndex)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                                            />
                                            <Input
                                                placeholder={`Option ${optionIndex + 1}: e.g., ${optionIndex === 0 ? "Berlin" :
                                                    optionIndex === 1 ? "Paris" :
                                                        optionIndex === 2 ? "London" : "Madrid"
                                                    }`}
                                                value={option}
                                                onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                                className="flex-1 text-sm sm:text-base"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={addQuestion}
                            className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                        </Button>

                        <Button
                            onClick={saveQuiz}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 sm:px-8"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Quiz
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}