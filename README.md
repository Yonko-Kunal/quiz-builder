# Quiz Builder

A modern, interactive web application for creating and taking quizzes. Built with Next.js, TypeScript, and Tailwind CSS, featuring a clean interface with dark mode support.

## Features

### Quiz Management
- **Create Quizzes**: Build custom quizzes with multiple-choice questions
- **Quiz Library**: View all created quizzes in a responsive grid layout
- **Delete Quizzes**: Remove unwanted quizzes from your collection
- **Local Storage**: All data is stored locally in the browser

### Quiz Creation
- **Custom Titles**: Set descriptive titles for your quizzes
- **Time Limits**: Configure quiz duration from 10 to 120 minutes
- **Multiple Questions**: Add unlimited questions to each quiz
- **Four Options**: Each question supports four multiple-choice answers
- **Correct Answer Selection**: Mark the correct answer for each question
- **Question Management**: Add, remove, and edit questions dynamically

### Quiz Taking Experience
- **Interactive Player**: Clean, distraction-free quiz interface
- **Real-time Timer**: Countdown timer with automatic submission when time expires
- **Progress Tracking**: Visual progress bar and question counter
- **Answer Selection**: Click to select answers, click again to deselect
- **Question Navigation**: Move between questions with Previous/Next buttons
- **Question Matrix**: Visual overview of all questions with status indicators
- **Mark for Review**: Flag questions for later review
- **Smart Status Tracking**: Questions are color-coded based on their status:
  - Green: Answered
  - Red: Skipped (visited but not answered)
  - Purple: Marked for review
  - Purple with green dot: Answered and marked for review
  - Gray: Not visited

### Results and Review
- **Instant Scoring**: Automatic calculation of quiz results
- **Percentage Score**: Display score as both fraction and percentage
- **Detailed Review**: See all questions with your answers and correct answers
- **Answer Comparison**: Clear indication of correct vs. selected answers

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Mobile Navigation**: Collapsible hamburger menu for mobile devices
- **Accessibility**: Screen reader support and keyboard navigation
- **Modern UI**: Clean design using shadcn/ui components

## Technology Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Theme Management**: next-themes for dark mode support
- **Storage**: Browser localStorage for data persistence

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quiz-builder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── create/            # Quiz creation page
│   ├── quiz/[id]/         # Quiz player page
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page with quiz library
│   └── globals.css        # Global styles and theme variables
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation component
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Dark mode toggle
└── lib/                   # Utilities and types
    ├── types.ts          # TypeScript interfaces
    └── storage.ts        # localStorage utilities
```

## Usage Guide

### Creating a Quiz

1. Click "Create New Quiz" from the home page or navigation
2. Enter a quiz title and select a time limit
3. Add questions by filling in:
   - Question text
   - Four answer options
   - Select the correct answer using radio buttons
4. Use "Add Question" to add more questions
5. Use "Remove" to delete unwanted questions
6. Click "Save Quiz" to save your quiz

### Taking a Quiz

1. Click the play button on any quiz card
2. Read each question and select your answer
3. Use navigation buttons to move between questions:
   - "Previous": Go to the previous question
   - "Mark for Review": Flag question and move to next
   - "Next": Move to the next question
   - "Submit Quiz": Complete the quiz (only on last question)
4. Use the menu button to access the question matrix
5. Click on any question number to jump directly to that question
6. Submit the quiz when ready

### Question Matrix

The question matrix provides a visual overview of your progress:
- Click the menu icon (hamburger) in the quiz header
- See all questions in a grid layout
- Colors indicate question status
- Click any question number to jump to that question
- View the legend to understand status colors

## Data Storage

All quiz data is stored locally in your browser using localStorage. This means:
- No server or database required
- Data persists between browser sessions
- Data is specific to each browser/device
- Clearing browser data will remove all quizzes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)