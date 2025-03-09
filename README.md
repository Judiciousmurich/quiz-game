## Project Overview
This project is an interactive quiz application built with HTML, CSS, and JavaScript. The application provides users with a challenging and engaging quiz experience, featuring multiple-choice questions across various topics.

## Features Implemented
### Core Functionality
- **Multiple-choice questions**: 10 knowledge-testing questions spanning various topics
- **Interactive UI**: Clean, responsive design with intuitive navigation
- **Question tracking**: Visual indicators showing answered/unanswered questions
- **Progress tracking**: Progress bar and question counter

### Enhanced User Experience
- **Customizable timer**: Adjustable time limit per question (10-120 seconds)
- **Time visualization**: Color-changing timer bar with warning indicators
- **Question navigation**: Ability to navigate between questions and revisit previous answers
- **Question indicators**: Visual overview of all questions with status indicators
- **Feedback system**: Immediate feedback on answer correctness
- **Score calculation**: Final score display with personalized performance message

### User Flow
1. **Start screen**: Users can set time per question and start the quiz
2. **Question screen**: Users can view questions, select answers, and navigate between questions
3. **Review capability**: "Check" button to verify answers during the quiz
4. **Completion safeguards**: Warning for unanswered questions before quiz completion
5. **Results screen**: Final score with personalized feedback
6. **Post-quiz options**: Review answers or restart the quiz

### Design Adjustments
- **Added question indicators**: Initially planned for linear navigation only, but implemented a circular indicator system for better question overview and direct navigation
- **Enhanced timer visualization**: Added color-coding for time warnings (turns red when time is running low)
- **Improved question status tracking**: Added a count of answered vs. total questions for better user awareness

### Functionality Changes
- **Removed showing correct answers**: Modified to show only if the user's answer was correct/incorrect without revealing the correct answer during review
- **Added safeguards**: Implemented warning for unanswered questions before quiz completion
- **Flexible time settings**: Added customizable time per question rather than fixed timing

## Technical Implementation
- **HTML5**: Structured content with semantic elements
- **CSS3**: Responsive design with intuitive visual feedback
- **JavaScript**: Dynamic content handling and interactive features
- **Modular code**: Separated UI handling, question logic, and timer functionality




