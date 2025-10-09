"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-background border-b border-border">
            <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Q</span>
                        </div>
                        <h1 className="text-xl font-semibold text-foreground">Quiz Builder</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-blue-600 font-medium">My Quizzes</Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">Reports</Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link href="/create">
                            <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Quiz
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center space-x-2">
                        <ThemeToggle />
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 p-6">
                                <SheetHeader>
                                    <SheetTitle>Navigation Menu</SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col space-y-6 mt-6">
                                    {/* Mobile Navigation Links */}
                                    <nav className="flex flex-col space-y-4">
                                        <Link
                                            href="/"
                                            className="text-blue-600 font-medium text-lg py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            My Quizzes
                                        </Link>
                                        <Link
                                            href="#"
                                            className="text-muted-foreground hover:text-foreground text-lg py-3 px-4 rounded-lg hover:bg-muted transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Reports
                                        </Link>
                                    </nav>

                                    {/* Mobile Create Button */}
                                    <div className="pt-4 border-t">
                                        <Link href="/create" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create New Quiz
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}