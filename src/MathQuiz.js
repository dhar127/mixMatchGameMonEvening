import React, { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from './UserContext';

// Tamil Translations
const translations = {
  english: {
    title: "Math Quiz Challenge",
    languageButton: "தமிழ்",
    beginner: "Beginner",
    intermediate: "Intermediate", 
    advanced: "Advanced",
    question: "Question",
    retry: "Retry",
    home: "Home",
    results: "Results",
    score: (score, total) => `You scored ${score}/${total}`,
    selectAnswerPrompt: "Drag the correct answer here:",
    sequencePrompt: "Order the steps by dragging and dropping them:",
    checkAnswer: "Check Answer",
    clearSequence: "Clear",
    submit: "Submit",
    answerPrompt: "Type your answer here...",
    correctAnswer: (answer) => `Correct Answer: ${answer}`,
    starPerformerTitle: "⭐ Star Performer!",
    achieverTitle: "🎯 Great Job!",
    needsPracticeTitle: "📚 Keep Practicing!",
    timeUp: "⏰ Time's up!",
    correct: "🎉 Correct! Well done!",
    instructions: "Instructions",
    startQuiz: "Start Quiz",
    nextQuestion: "Next Question",
    finalScore: "Final Score",
    timeBonus: "Time Bonus",
    totalTime: "Total Time",
    accuracy: "Accuracy",
    performance: "Performance",
    playAgain: "Play Again",
    backToMenu: "Back to Menu"
  },
  tamil: {
    title: "கணித வினாடி வினா சவால்",
    languageButton: "English", 
    beginner: "ஆரம்பநிலை",
    intermediate: "இடைநிலை",
    advanced: "மேம்பட்ட நிலை",
    question: "கேள்வி",
    retry: "மீண்டும் முயற்சி செய்",
    home: "முகப்பு",
    results: "முடிவுகள்",
    score: (score, total) => `நீங்கள் ${score}/${total} மதிப்பெண் பெற்றீர்கள்`,
    selectAnswerPrompt: "சரியான விடையை இங்கே இழுத்து விடுங்கள்:",
    sequencePrompt: "படிநிலைகளை இழுத்து விட்டு வரிசைப்படுத்துங்கள்:",
    checkAnswer: "விடையைச் சரிபார்க்கவும்",
    clearSequence: "அழி",
    submit: "சமர்ப்பிக்கவும்",
    answerPrompt: "உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்...",
    correctAnswer: (answer) => `சரியான விடை: ${answer}`,
    starPerformerTitle: "⭐ சிறந்த சாதனையாளர்!",
    achieverTitle: "🎯 நல்லது!",
    needsPracticeTitle: "📚 தொடர்ந்து பயிற்சி செய்யுங்கள்!",
    timeUp: "⏰ நேரம் முடிந்துவிட்டது!",
    correct: "🎉 சரி! நல்லது!",
    instructions: "வழிமுறைகள்",
    startQuiz: "வினாடி வினா தொடங்கு",
    nextQuestion: "அடுத்த கேள்வி",
    finalScore: "இறுதி மதிப்பெண்",
    timeBonus: "நேர போனஸ்",
    totalTime: "மொத்த நேரம்",
    accuracy: "துல்லியம்",
    performance: "செயல்திறன்",
    playAgain: "மீண்டும் விளையாடு",
    backToMenu: "மெனுவிற்கு திரும்பு"
  },
};

// Enhanced Question Bank
const questionBank = {
  beginner: [
    { q: "What is 45 ÷ 9?", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "45 ÷ 9 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "LCM of 12 and 18", correct: "36", options: ["24", "36", "48", "12"], language: { tamil: "12 மற்றும் 18-இன் மீ.சி.ம" }, type: "dragAndDrop" },
    { q: "HCF of 36 and 54", correct: "18", options: ["6", "9", "18", "27"], language: { tamil: "36 மற்றும் 54-இன் மீ.பொ.வ" }, type: "dragAndDrop" },
    { q: "Solve: 15 + (8 × 2)", correct: "31", options: ["31", "23", "39", "20"], language: { tamil: "தீர்க்கவும்: 15 + (8 × 2)" }, type: "dragAndDrop" },
    { q: "Area of a square with side 5 cm", correct: "25", options: ["10", "20", "25", "30"], language: { tamil: "5 செ.மீ பக்கமுள்ள சதுரத்தின் பரப்பளவு" }, type: "dragAndDrop" },
    { q: "What is the value of 3²?", correct: "9", language: { tamil: "3²-இன் மதிப்பு என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the square root of 64?", correct: "8", language: { tamil: "64-இன் வர்க்கமூலம் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is 7 × 8?", correct: "56", options: ["48", "56", "54", "64"], language: { tamil: "7 × 8 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "What is 72 ÷ 8?", correct: "9", options: ["8", "9", "6", "10"], language: { tamil: "72 ÷ 8 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Find the perimeter of a square with side 6 cm", correct: "24", options: ["18", "20", "24", "36"], language: { tamil: "6 செ.மீ பக்கமுள்ள சதுரத்தின் சுற்றளவு" }, type: "dragAndDrop" },
    { q: "Simplify: 50 – 25 ÷ 5", correct: "45", options: ["25", "45", "35", "40"], language: { tamil: "50 – 25 ÷ 5-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "What is 3/4 of 20?", correct: "15", options: ["10", "12", "15", "18"], language: { tamil: "20-இன் 3/4 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Area of a rectangle with length 8 cm and breadth 3 cm", correct: "24", options: ["11", "16", "20", "24"], language: { tamil: "8 செ.மீ நீளம் மற்றும் 3 செ.மீ அகலம் கொண்ட செவ்வகத்தின் பரப்பளவு" }, type: "dragAndDrop" },
    { q: "Solve: 5 × (6 + 2)", correct: "40", options: ["35", "36", "40", "42"], language: { tamil: "தீர்க்கவும்: 5 × (6 + 2)" }, type: "dragAndDrop" },
    { q: "What is the square of 12?", correct: "144", language: { tamil: "12-இன் வர்க்கம் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the cube root of 27?", correct: "3", language: { tamil: "27-இன் கனமூலம் என்ன?" }, type: "fillInTheBlank" },
    { q: "LCM of 8 and 12", correct: "24", options: ["16", "18", "20", "24"], language: { tamil: "8 மற்றும் 12-இன் மீ.சி.ம" }, type: "dragAndDrop" },
    { q: "HCF of 28 and 42", correct: "14", options: ["7", "14", "21", "28"], language: { tamil: "28 மற்றும் 42-இன் மீ.பொ.வ" }, type: "dragAndDrop" },
    { q: "If side = 7 cm, area of square?", correct: "49", options: ["21", "42", "49", "56"], language: { tamil: "7 செ.மீ பக்கமுள்ள சதுரத்தின் பரப்பளவு" }, type: "dragAndDrop" },
    { q: "Convert 3/5 into percentage", correct: "60%", options: ["50%", "55%", "60%", "65%"], language: { tamil: "3/5-ஐ சதவீதமாக மாற்றவும்" }, type: "dragAndDrop" },
    { q: "Simplify: 2³", correct: "8", language: { tamil: "2³-ஐ எளிமைப்படுத்தவும்" }, type: "fillInTheBlank" },
    { q: "What is 25% of 200?", correct: "50", options: ["25", "50", "75", "100"], language: { tamil: "200-இன் 25% என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "What is the average of 5, 10, 15?", correct: "10", options: ["5", "8", "10", "12"], language: { tamil: "5, 10, 15-இன் சராசரி என்ன?" }, type: "dragAndDrop" },
    { q: "Simplify: (9 × 3) – (5 × 2)", correct: "17", options: ["19", "17", "20", "15"], language: { tamil: "(9 × 3) – (5 × 2)-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "If a triangle has sides 3, 4, 5, what type is it?", correct: "Right angled", options: ["Equilateral", "Isosceles", "Scalene", "Right angled"], language: { tamil: "3, 4, 5 பக்கங்கள் உள்ள முக்கோணம் எப்படிப்பட்டது?" }, type: "dragAndDrop" },
    { q: "What is the perimeter of a rectangle with length 10 cm and breadth 6 cm?", correct: "32", options: ["16", "20", "26", "32"], language: { tamil: "10 செ.மீ நீளம் மற்றும் 6 செ.மீ அகலம் கொண்ட செவ்வகத்தின் சுற்றளவு" }, type: "dragAndDrop" },
    { q: "What is 15²?", correct: "225", language: { tamil: "15²-இன் மதிப்பு என்ன?" }, type: "fillInTheBlank" },
    { q: "Find mode of 2, 3, 3, 5, 6", correct: "3", options: ["2", "3", "5", "6"], language: { tamil: "2, 3, 3, 5, 6-இன் அடிக்கடி வருவதை (mode) கண்டறியவும்" }, type: "dragAndDrop" },
    { q: "If radius = 7 cm, area of circle? (use π = 22/7)", correct: "154", options: ["144", "154", "147", "160"], language: { tamil: "ஆரம் 7 செ.மீ உள்ள வட்டத்தின் பரப்பளவு (π = 22/7 பயன்படுத்தவும்)" }, type: "dragAndDrop" },
    { q: "What is 9 × 12?", correct: "108", options: ["96", "100", "108", "112"], language: { tamil: "9 × 12 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: 7 + (4 × 5)", correct: "27", options: ["20", "22", "27", "30"], language: { tamil: "தீர்க்கவும்: 7 + (4 × 5)" }, type: "dragAndDrop" },
    { q: "What is the square root of 121?", correct: "11", language: { tamil: "121-இன் வர்க்கமூலம் என்ன?" }, type: "fillInTheBlank" },
    { q: "Arrange steps to find average of numbers 10, 20, 30.", correct: ["Add all numbers", "Divide sum by 3", "Get answer = 20"], options: ["Add all numbers", "Get answer = 20", "Divide sum by 3"], language: { tamil: "10, 20, 30 எண்களின் சராசரியை காணும் படிகளை வரிசைப்படுத்துங்கள்." }, type: "sequencing" },
    { q: "What is 100 ÷ 4?", correct: "25", options: ["20", "24", "25", "30"], language: { tamil: "100 ÷ 4 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "If a triangle has angles 60°, 60°, 60°, what type is it?", correct: "Equilateral", options: ["Isosceles", "Scalene", "Equilateral", "Right angled"], language: { tamil: "60°, 60°, 60° கோணங்கள் கொண்ட முக்கோணம் எப்படிப்பட்டது?" }, type: "dragAndDrop" },
    { q: "Simplify: (12 × 2) + (15 ÷ 3)", correct: "29", options: ["30", "27", "29", "26"], language: { tamil: "(12 × 2) + (15 ÷ 3)-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "What is 2/3 of 90?", correct: "60", options: ["30", "45", "60", "75"], language: { tamil: "90-இன் 2/3 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Area of a triangle with base 10 cm and height 6 cm", correct: "30", options: ["20", "25", "30", "35"], language: { tamil: "10 செ.மீ அடிப்பாகம் மற்றும் 6 செ.மீ உயரம் கொண்ட முக்கோணத்தின் பரப்பளவு" }, type: "dragAndDrop" },
    { q: "Find HCF of 45 and 75", correct: "15", options: ["5", "10", "15", "25"], language: { tamil: "45 மற்றும் 75-இன் மீ.பொ.வ" }, type: "dragAndDrop" },
    { q: "What is the square of 20?", correct: "400", language: { tamil: "20-இன் வர்க்கம் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the cube of 4?", correct: "64", language: { tamil: "4-இன் கன மதிப்பு என்ன?" }, type: "fillInTheBlank" },
    { q: "What is 5 × 16?", correct: "80", options: ["60", "70", "80", "90"], language: { tamil: "5 × 16 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Simplify: 90 – (6 × 5)", correct: "60", options: ["70", "65", "60", "55"], language: { tamil: "90 – (6 × 5)-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "If side = 9 cm, perimeter of square?", correct: "36", options: ["18", "27", "36", "45"], language: { tamil: "9 செ.மீ பக்கமுள்ள சதுரத்தின் சுற்றளவு" }, type: "dragAndDrop" },
    { q: "Convert 0.25 into fraction", correct: "1/4", options: ["1/2", "1/3", "1/4", "3/4"], language: { tamil: "0.25-ஐ எளிய பகுத்தொகுதியாக மாற்றவும்" }, type: "dragAndDrop" },
    { q: "Simplify: 5² + 6²", correct: "61", options: ["56", "60", "61", "62"], language: { tamil: "5² + 6²-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "Find median of 4, 7, 10", correct: "7", options: ["4", "7", "10", "6"], language: { tamil: "4, 7, 10-இன் இடைநிலை என்ன?" }, type: "dragAndDrop" },
    { q: "What is 12% of 200?", correct: "24", options: ["20", "22", "24", "26"], language: { tamil: "200-இன் 12% என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Simplify: (8 × 4) – (12 ÷ 3)", correct: "28", options: ["32", "28", "30", "26"], language: { tamil: "(8 × 4) – (12 ÷ 3)-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "If a rectangle has length 12 cm and breadth 5 cm, area?", correct: "60", options: ["55", "58", "60", "62"], language: { tamil: "12 செ.மீ நீளம் மற்றும் 5 செ.மீ அகலம் கொண்ட செவ்வகத்தின் பரப்பளவு" }, type: "dragAndDrop" },
    { q: "What is the average of 2, 4, 6, 8?", correct: "5", options: ["4", "5", "6", "7"], language: { tamil: "2, 4, 6, 8-இன் சராசரி என்ன?" }, type: "dragAndDrop" },
    { q: "Find LCM of 9 and 15", correct: "45", options: ["30", "35", "40", "45"], language: { tamil: "9 மற்றும் 15-இன் மீ.சி.ம" }, type: "dragAndDrop" },
    { q: "Square root of 225?", correct: "15", language: { tamil: "225-இன் வர்க்கமூலம் என்ன?" }, type: "fillInTheBlank" },
    { q: "Simplify: 7³", correct: "343", language: { tamil: "7³-ஐ எளிமைப்படுத்தவும்" }, type: "fillInTheBlank" },
    { q: "If radius = 14 cm, circumference of circle? (use π = 22/7)", correct: "88", options: ["84", "88", "90", "92"], language: { tamil: "ஆரம் 14 செ.மீ உள்ள வட்டத்தின் சுற்றளவு (π = 22/7 பயன்படுத்தவும்)" }, type: "dragAndDrop" },
    { q: "What is 18 × 7?", correct: "126", options: ["118", "120", "124", "126"], language: { tamil: "18 × 7 என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "Arrange steps to find perimeter of rectangle with l = 8, b = 5.", correct: ["Add length + breadth", "Multiply by 2", "Get answer = 26"], options: ["Get answer = 26", "Multiply by 2", "Add length + breadth"], language: { tamil: "நீளம் = 8, அகலம் = 5 உள்ள செவ்வகத்தின் சுற்றளவை காணும் படிகளை வரிசைப்படுத்துங்கள்." }, type: "sequencing" },
    { q: "Simplify: (20 ÷ 4) + (3 × 6)", correct: "23", options: ["22", "23", "24", "25"], language: { tamil: "(20 ÷ 4) + (3 × 6)-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
  ],
 
  intermediate: [
   { q: "Find median of 5, 7, 9, 11, 13", correct: "9", options: ["7", "9", "11", "8"], language: { tamil: "5, 7, 9, 11, 13-இன் இடைநிலை என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: 2x + 3 = 11", correct: "4", options: ["2", "3", "4", "5"], language: { tamil: "தீர்க்கவும்: 2x + 3 = 11" }, type: "dragAndDrop" },
    { q: "What is 20% of 150?", correct: "30", options: ["15", "30", "50", "100"], language: { tamil: "150-இன் 20% என்றால் என்ன?" }, type: "dragAndDrop" },
    { q: "What is the next prime number after 13?", correct: "17", language: { tamil: "13-க்குப் பிறகு வரும் அடுத்த பகா எண் என்ன?" }, type: "fillInTheBlank" },
    { q: "If a circle has a circumference of 8π, what is its radius?", correct: "4", language: { tamil: "ஒரு வட்டத்தின் சுற்றளவு 8π என்றால், அதன் ஆரம் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the slope of the line y = 3x + 2?", correct: "3", options: ["2", "3", "5", "1"], language: { tamil: "y = 3x + 2 கோட்டின் சாய்வு என்ன?" }, type: "dragAndDrop" },
        { q: "Solve: 3x – 5 = 10", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "தீர்க்கவும்: 3x – 5 = 10" }, type: "dragAndDrop" },
    { q: "Find the value of (x – 2)(x + 2) when x = 5", correct: "21", options: ["20", "21", "22", "25"], language: { tamil: "x = 5 ஆகும் போது (x – 2)(x + 2)-இன் மதிப்பு" }, type: "dragAndDrop" },
    { q: "What is the distance between (0,0) and (3,4)?", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "(0,0) மற்றும் (3,4) இடையிலான தூரம் என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: x² – 9 = 0", correct: "±3", language: { tamil: "தீர்க்கவும்: x² – 9 = 0" }, type: "fillInTheBlank" },
    { q: "Find slope of line joining (2,3) and (4,7)", correct: "2", options: ["1", "2", "3", "4"], language: { tamil: "(2,3) மற்றும் (4,7) இணைக்கும் கோட்டின் சாய்வு" }, type: "dragAndDrop" },
    { q: "sin30° = ?", correct: "1/2", options: ["1/2", "√3/2", "√2/2", "1"], language: { tamil: "sin30° = ?" }, type: "dragAndDrop" },
    { q: "cos60° = ?", correct: "1/2", options: ["1/2", "√3/2", "√2/2", "0"], language: { tamil: "cos60° = ?" }, type: "dragAndDrop" },
    { q: "tan45° = ?", correct: "1", options: ["0", "1", "√3", "√3/3"], language: { tamil: "tan45° = ?" }, type: "dragAndDrop" },
    { q: "Solve: 2x + y = 10, if y = 4", correct: "3", options: ["2", "3", "4", "5"], language: { tamil: "2x + y = 10, y = 4 ஆகும் போது x-இன் மதிப்பு" }, type: "dragAndDrop" },
    { q: "Find probability of getting head in a coin toss", correct: "1/2", options: ["0", "1/2", "1/3", "1"], language: { tamil: "ஒரு நாணயத்தை வீசும் போது தலை வரும் சாத்தியம்" }, type: "dragAndDrop" },
    { q: "What is mean of 2, 4, 6, 8, 10?", correct: "6", options: ["5", "6", "7", "8"], language: { tamil: "2, 4, 6, 8, 10-இன் சராசரி என்ன?" }, type: "dragAndDrop" },
    { q: "Find median of 12, 14, 16, 18, 20", correct: "16", options: ["14", "15", "16", "18"], language: { tamil: "12, 14, 16, 18, 20-இன் இடைநிலை" }, type: "dragAndDrop" },
    { q: "If P(E) = 0.4, find P(not E)", correct: "0.6", options: ["0.4", "0.5", "0.6", "0.7"], language: { tamil: "P(E) = 0.4 என்றால், P(not E)-ஐ கண்டறிக" }, type: "dragAndDrop" },
    { q: "Simplify: (x + 3)²", correct: "x² + 6x + 9", language: { tamil: "(x + 3)²-ஐ எளிமைப்படுத்தவும்" }, type: "fillInTheBlank" },
    { q: "Find roots of x² – 5x + 6 = 0", correct: "2,3", options: ["1,6", "2,3", "3,4", "2,4"], language: { tamil: "x² – 5x + 6 = 0-இன் வேர்கள்" }, type: "dragAndDrop" },
    { q: "Equation of line parallel to y = 2x + 3 and passing through (0,1)", correct: "y = 2x + 1", language: { tamil: "(0,1)-இல் செல்லும் y = 2x + 3-க்கு இணையான கோட்டின் சமன்பாடு" }, type: "fillInTheBlank" },
    { q: "Simplify: sin²θ + cos²θ", correct: "1", options: ["0", "1", "θ", "2"], language: { tamil: "sin²θ + cos²θ-ஐ எளிமைப்படுத்தவும்" }, type: "dragAndDrop" },
    { q: "If radius = 7 cm, find volume of sphere (use π = 22/7)", correct: "1436.67", options: ["1436.67", "1540", "1500", "1400"], language: { tamil: "ஆரம் 7 செ.மீ உள்ள உருளையின் கன அளவு (π = 22/7)" }, type: "dragAndDrop" },
    { q: "Surface area of cube with side 4 cm", correct: "96", options: ["64", "80", "96", "100"], language: { tamil: "4 செ.மீ பக்கமுள்ள கனத்தின் மேற்பரப்பளவு" }, type: "dragAndDrop" },
    { q: "Simplify: (a + b)² – (a – b)²", correct: "4ab", language: { tamil: "(a + b)² – (a – b)²-ஐ எளிமைப்படுத்தவும்" }, type: "fillInTheBlank" },
    { q: "Find distance between (1,2) and (4,6)", correct: "5", options: ["4", "5", "6", "7"], language: { tamil: "(1,2) மற்றும் (4,6) இடையிலான தூரம்" }, type: "dragAndDrop" },
    { q: "tan²θ + 1 = ?", correct: "sec²θ", options: ["cosec²θ", "cos²θ", "sec²θ", "cot²θ"], language: { tamil: "tan²θ + 1 = ?" }, type: "dragAndDrop" },
    { q: "Arrange steps to solve 2x – 4 = 10", correct: ["Add 4 to both sides", "Simplify to get 2x = 14", "Divide by 2", "x = 7"], options: ["Divide by 2", "x = 7", "Simplify to get 2x = 14", "Add 4 to both sides"], language: { tamil: "2x – 4 = 10-ஐ தீர்க்கும் படிகளை வரிசைப்படுத்துங்கள்." }, type: "sequencing" },
    { q: "If hypotenuse = 13 and one side = 5, find other side", correct: "12", options: ["10", "11", "12", "13"], language: { tamil: "ஒரு நாற்கர சாய்வு முக்கோணத்தில், ஹைப்போட்டினியூஸ் = 13 மற்றும் ஒரு பக்கம் = 5 என்றால், மற்ற பக்கம் என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: 5x + 7 = 27", correct: "4", options: ["3", "4", "5", "6"], language: { tamil: "தீர்க்கவும்: 5x + 7 = 27" }, type: "dragAndDrop" },
    { q: "Factorize: x² – 7x + 12", correct: "(x – 3)(x – 4)", language: { tamil: "x² – 7x + 12-ஐ காரணி பிரிக்கவும்" }, type: "fillInTheBlank" },
    { q: "Find distance between (2,5) and (5,9)", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "(2,5) மற்றும் (5,9) இடையிலான தூரம்" }, type: "dragAndDrop" },
    { q: "Find slope of line y = 3x + 7", correct: "3", options: ["3", "7", "-3", "1/3"], language: { tamil: "y = 3x + 7-இன் சாய்வு" }, type: "dragAndDrop" },
    { q: "sin²45° + cos²45° = ?", correct: "1", options: ["0", "1", "√2", "2"], language: { tamil: "sin²45° + cos²45° = ?" }, type: "dragAndDrop" },
    { q: "Find value of tan30°", correct: "1/√3", options: ["1/√3", "√3", "1", "0"], language: { tamil: "tan30°-இன் மதிப்பு" }, type: "dragAndDrop" },
    { q: "Solve: 2x – 3y = 12, if y = 2", correct: "9", options: ["6", "7", "8", "9"], language: { tamil: "2x – 3y = 12, y = 2 என்றால் x-இன் மதிப்பு" }, type: "dragAndDrop" },
    { q: "Find probability of getting an even number in a dice roll", correct: "1/2", options: ["1/6", "1/2", "2/3", "1"], language: { tamil: "பாச்சியில் சீரெண் வருவதற்கான சாத்தியம்" }, type: "dragAndDrop" },
    { q: "Mean of 5, 10, 15, 20, 25", correct: "15", options: ["10", "12", "15", "20"], language: { tamil: "5, 10, 15, 20, 25-இன் சராசரி" }, type: "dragAndDrop" },
    { q: "Find mode of 2, 4, 4, 6, 8, 8, 8, 10", correct: "8", options: ["4", "6", "8", "10"], language: { tamil: "2, 4, 4, 6, 8, 8, 8, 10-இன் அதிகம் தோன்றும் மதிப்பு" }, type: "dragAndDrop" },
    { q: "Simplify: (x – 5)(x + 5)", correct: "x² – 25", language: { tamil: "(x – 5)(x + 5)-ஐ எளிமைப்படுத்தவும்" }, type: "fillInTheBlank" },
    { q: "Roots of x² – 4x – 5 = 0", correct: "5,-1", options: ["5,-1", "4,-1", "5,1", "4,5"], language: { tamil: "x² – 4x – 5 = 0-இன் வேர்கள்" }, type: "dragAndDrop" },
    { q: "Equation of line through (0,2) with slope 2", correct: "y = 2x + 2", language: { tamil: "சாய்வு 2 மற்றும் (0,2) வழியாக செல்லும் கோட்டின் சமன்பாடு" }, type: "fillInTheBlank" },
    { q: "Find value of cos²30° + sin²30°", correct: "1", options: ["0", "1", "√3/2", "1/2"], language: { tamil: "cos²30° + sin²30° = ?" }, type: "dragAndDrop" },
    { q: "Volume of cone with r = 7 cm, h = 12 cm (π = 22/7)", correct: "616", options: ["616", "700", "650", "720"], language: { tamil: "ஆரம் 7 செ.மீ, உயரம் 12 செ.மீ கொண்ட கூம்பின் கன அளவு" }, type: "dragAndDrop" },
    { q: "Surface area of sphere of radius 7 cm", correct: "616", options: ["616", "700", "770", "600"], language: { tamil: "ஆரம் 7 செ.மீ கொண்ட உருளையின் மேற்பரப்பளவு" }, type: "dragAndDrop" },
    { q: "Simplify: (a + b)³ – (a – b)³", correct: "2b(3a² + b²)", language: { tamil: "(a + b)³ – (a – b)³-ஐ எளிமைப்படுத்தவும்" }, type: "fillInTheBlank" },
    { q: "Find distance between (–3,0) and (0,4)", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "(–3,0) மற்றும் (0,4) இடையிலான தூரம்" }, type: "dragAndDrop" },
    { q: "cot45° = ?", correct: "1", options: ["0", "1", "√3", "1/√3"], language: { tamil: "cot45° = ?" }, type: "dragAndDrop" },
    { q: "Arrange steps to solve x/2 + 5 = 9", correct: ["Subtract 5 from both sides", "Simplify to get x/2 = 4", "Multiply both sides by 2", "x = 8"], options: ["Multiply both sides by 2", "Subtract 5 from both sides", "x = 8", "Simplify to get x/2 = 4"], language: { tamil: "x/2 + 5 = 9-ஐ தீர்க்கும் படிகளை வரிசைப்படுத்துங்கள்." }, type: "sequencing" },
    { q: "If diameter of circle = 14 cm, find area (π = 22/7)", correct: "154", options: ["144", "154", "160", "168"], language: { tamil: "வட்டத்தின் விட்டம் 14 செ.மீ என்றால், பரப்பளவு" }, type: "dragAndDrop" },
    { q: "Solve: 7x – 21 = 0", correct: "3", options: ["0", "1", "2", "3"], language: { tamil: "தீர்க்கவும்: 7x – 21 = 0" }, type: "dragAndDrop" },
    { q: "Find midpoint of (2,4) and (6,8)", correct: "(4,6)", options: ["(3,5)", "(4,6)", "(5,7)", "(6,6)"], language: { tamil: "(2,4) மற்றும் (6,8)-இன் நடுப்புள்ளி" }, type: "dragAndDrop" },
    { q: "If P(A) = 0.7, find P(not A)", correct: "0.3", options: ["0.2", "0.3", "0.4", "0.5"], language: { tamil: "P(A) = 0.7 என்றால், P(not A)" }, type: "dragAndDrop" },
    { q: "Find equation of line through (1,2) with slope 1", correct: "y – 2 = (x – 1)", language: { tamil: "சாய்வு 1 மற்றும் (1,2) வழியாக செல்லும் கோட்டின் சமன்பாடு" }, type: "fillInTheBlank" }
  ],
  advanced: [
    { q: "Derivative of x²", correct: "2x", options: ["2x", "x²", "2", "x"], language: { tamil: "x²-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "∫ x dx (definite integral from 0 to 1)", correct: "0.5", options: ["0.25", "0.5", "1", "2"], language: { tamil: "∫ x dx (0 முதல் 1 வரை வரையறுக்கப்பட்ட தொகையீடு)" }, type: "dragAndDrop" },
    { q: "sin²θ + cos²θ = ?", correct: "1", options: ["0", "1", "2", "θ"], language: { tamil: "sin²θ + cos²θ = ?" }, type: "dragAndDrop" },
    {
      q: "Order the steps to solve the equation 2x + 4 = 10.",
      correct: ["Subtract 4 from both sides", "Simplify to get 2x = 6", "Divide both sides by 2", "The answer is x = 3"],
      options: ["The answer is x = 3", "Subtract 4 from both sides", "Divide both sides by 2", "Simplify to get 2x = 6"],
      language: { tamil: "சமன்பாடு 2x + 4 = 10-ஐ தீர்க்கும் படிநிலைகளை வரிசைப்படுத்துங்கள்." },
      type: "sequencing"
    },
    { q: "What is the derivative of sin(x)?", correct: "cos(x)", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], language: { tamil: "sin(x)-இன் வகைக்கெழு என்ன?" }, type: "dragAndDrop" },
    { q: "Solve: log₂(8)", correct: "3", language: { tamil: "தீர்க்கவும்: log₂(8)" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (e^x)", correct: "e^x", options: ["1", "e^x", "xe^(x-1)", "ln(x)"], language: { tamil: "d/dx (e^x)-ஐ வேறுபடுத்தவும்" }, type: "dragAndDrop" },
    { q: "Differentiate: d/dx (ln x)", correct: "1/x", options: ["ln x", "1/x", "x", "e^x"], language: { tamil: "d/dx (ln x)" }, type: "dragAndDrop" },
    { q: "Integrate: ∫ cos x dx", correct: "sin x + C", options: ["cos x + C", "sin x + C", "-cos x + C", "-sin x + C"], language: { tamil: "∫ cos x dx" }, type: "dragAndDrop" },
    { q: "Integrate: ∫ 1/x dx", correct: "ln|x| + C", language: { tamil: "∫ 1/x dx" }, type: "fillInTheBlank" },
    { q: "Solve: ∫ e^x dx", correct: "e^x + C", language: { tamil: "∫ e^x dx" }, type: "fillInTheBlank" },
    { q: "If A = [[1,2],[3,4]], find det(A)", correct: "-2", options: ["-2", "2", "4", "1"], language: { tamil: "A = [[1,2],[3,4]] என்றால், det(A)" }, type: "dragAndDrop" },
    { q: "Find adjoint of [[1,2],[3,4]]", correct: "[[4,-2],[-3,1]]", language: { tamil: "[[1,2],[3,4]]-இன் adjoint" }, type: "fillInTheBlank" },
    { q: "Solve: ∫ x² dx", correct: "x³/3 + C", language: { tamil: "∫ x² dx" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (sin x cos x)", correct: "cos²x – sin²x", options: ["cos²x – sin²x", "2sin x cos x", "1", "0"], language: { tamil: "d/dx (sin x cos x)" }, type: "dragAndDrop" },
    { q: "If A = [[2,0],[0,3]], find eigenvalues", correct: "2,3", options: ["0,0", "2,3", "1,3", "2,4"], language: { tamil: "A = [[2,0],[0,3]] என்றால், eigenvalues" }, type: "dragAndDrop" },
    { q: "Find derivative of log₁₀ x", correct: "1/(x ln 10)", language: { tamil: "log₁₀ x-இன் வேறுபாடு" }, type: "fillInTheBlank" },
    { q: "Find ∫ 2x e^(x²) dx", correct: "e^(x²) + C", language: { tamil: "∫ 2x e^(x²) dx" }, type: "fillInTheBlank" },
    { q: "If f(x) = x³, find f'(2)", correct: "12", options: ["6", "8", "12", "10"], language: { tamil: "f(x) = x³ என்றால், f'(2)" }, type: "dragAndDrop" },
    { q: "Solve: ∫ sec²x dx", correct: "tan x + C", options: ["sec x + C", "tan x + C", "-tan x + C", "cot x + C"], language: { tamil: "∫ sec²x dx" }, type: "dragAndDrop" },
    { q: "Find limit x→0 (sin x / x)", correct: "1", options: ["0", "1", "∞", "Does not exist"], language: { tamil: "x→0 (sin x / x)-இன் வரம்பு" }, type: "dragAndDrop" },
    { q: "Find derivative of tan x", correct: "sec²x", options: ["cos²x", "sec²x", "cot x", "-sec²x"], language: { tamil: "tan x-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Find rank of [[1,2],[2,4]]", correct: "1", options: ["0", "1", "2", "3"], language: { tamil: "[[1,2],[2,4]]-இன் rank" }, type: "dragAndDrop" },
    { q: "Evaluate: ∫₀^π sin x dx", correct: "2", options: ["0", "1", "2", "π"], language: { tamil: "∫₀^π sin x dx" }, type: "dragAndDrop" },
    { q: "Evaluate: ∫₀^1 (1 – x) dx", correct: "1/2", options: ["1", "1/2", "0", "2"], language: { tamil: "∫₀^1 (1 – x) dx" }, type: "dragAndDrop" },
    { q: "If A = [[1,0],[0,1]], then A⁻¹ = ?", correct: "[[1,0],[0,1]]", options: ["0", "1", "A", "I"], language: { tamil: "A = I என்றால், A⁻¹" }, type: "dragAndDrop" },
    { q: "Differentiate: d/dx (x⁴)", correct: "4x³", options: ["4x²", "x³", "4x³", "x²"], language: { tamil: "x⁴-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Find derivative of cos x", correct: "-sin x", options: ["cos x", "sin x", "-cos x", "-sin x"], language: { tamil: "cos x-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Solve: ∫ 1/(1 + x²) dx", correct: "tan⁻¹x + C", language: { tamil: "∫ 1/(1 + x²) dx" }, type: "fillInTheBlank" },
    { q: "Find eigenvalues of [[0,1],[1,0]]", correct: "1, -1", options: ["0,0", "1,-1", "1,1", "-1,-1"], language: { tamil: "A = [[0,1],[1,0]] என்றால், eigenvalues" }, type: "dragAndDrop" },
    { q: "If y = x^x, find dy/dx", correct: "x^x(1 + ln x)", language: { tamil: "y = x^x என்றால், dy/dx" }, type: "fillInTheBlank" },
     { q: "Differentiate: d/dx (x ln x)", correct: "1 + ln x", language: { tamil: "d/dx (x ln x)" }, type: "fillInTheBlank" },
    { q: "Find derivative of e^(2x)", correct: "2e^(2x)", options: ["e^(2x)", "2e^(2x)", "e^x", "2e^x"], language: { tamil: "e^(2x)-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Evaluate: ∫ sin²x dx", correct: "(x/2) – (sin2x/4) + C", language: { tamil: "∫ sin²x dx" }, type: "fillInTheBlank" },
    { q: "Find ∫ 1/(√(1–x²)) dx", correct: "sin⁻¹x + C", language: { tamil: "∫ 1/(√(1–x²)) dx" }, type: "fillInTheBlank" },
    { q: "Find ∫ tan x dx", correct: "–ln|cos x| + C", language: { tamil: "∫ tan x dx" }, type: "fillInTheBlank" },
    { q: "Limit x→∞ (1 + 1/x)^x", correct: "e", options: ["0", "1", "e", "∞"], language: { tamil: "x→∞ (1 + 1/x)^x-இன் வரம்பு" }, type: "dragAndDrop" },
    { q: "Solve: ∫ cos²x dx", correct: "(x/2) + (sin2x/4) + C", language: { tamil: "∫ cos²x dx" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (tan⁻¹x)", correct: "1/(1+x²)", language: { tamil: "d/dx (tan⁻¹x)" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (cot⁻¹x)", correct: "-1/(1+x²)", language: { tamil: "d/dx (cot⁻¹x)" }, type: "fillInTheBlank" },
    { q: "Solve: ∫ dx/(x²+1)", correct: "tan⁻¹x + C", language: { tamil: "∫ dx/(x²+1)" }, type: "fillInTheBlank" },
    { q: "If A = [[2,1],[1,2]], find det(A)", correct: "3", options: ["2", "3", "4", "5"], language: { tamil: "A = [[2,1],[1,2]] என்றால், det(A)" }, type: "dragAndDrop" },
    { q: "Find inverse of [[1,2],[3,4]]", correct: "[[-2,1],[1.5,-0.5]]", language: { tamil: "[[1,2],[3,4]]-இன் பிரதிபலன் (inverse)" }, type: "fillInTheBlank" },
    { q: "Find ∫ dx/(√(x²+1))", correct: "sinh⁻¹x + C", language: { tamil: "∫ dx/(√(x²+1))" }, type: "fillInTheBlank" },
    { q: "Evaluate: ∫₀^π/2 cos x dx", correct: "1", options: ["0", "1", "2", "π/2"], language: { tamil: "∫₀^(π/2) cos x dx" }, type: "dragAndDrop" },
    { q: "Evaluate: ∫₀^π/2 sin x dx", correct: "1", options: ["0", "1", "2", "π/2"], language: { tamil: "∫₀^(π/2) sin x dx" }, type: "dragAndDrop" },
    { q: "If f(x) = sin x, find f''(x)", correct: "-sin x", options: ["cos x", "-sin x", "-cos x", "sin x"], language: { tamil: "f(x) = sin x என்றால், f''(x)" }, type: "dragAndDrop" },
    { q: "If f(x) = cos x, find f''(x)", correct: "-cos x", options: ["cos x", "-cos x", "sin x", "-sin x"], language: { tamil: "f(x) = cos x என்றால், f''(x)" }, type: "dragAndDrop" },
    { q: "Find eigenvalues of [[3,0],[0,5]]", correct: "3,5", options: ["0,0", "3,5", "1,5", "3,3"], language: { tamil: "[[3,0],[0,5]]-இன் eigenvalues" }, type: "dragAndDrop" },
    { q: "Find rank of [[1,2,3],[2,4,6]]", correct: "1", options: ["1", "2", "3", "0"], language: { tamil: "[[1,2,3],[2,4,6]]-இன் rank" }, type: "dragAndDrop" },
    { q: "Find ∫ e^(–x) dx", correct: "–e^(–x) + C", language: { tamil: "∫ e^(–x) dx" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (x³ ln x)", correct: "3x² ln x + x²", language: { tamil: "d/dx (x³ ln x)" }, type: "fillInTheBlank" },
    { q: "Solve: ∫ cosh x dx", correct: "sinh x + C", language: { tamil: "∫ cosh x dx" }, type: "fillInTheBlank" },
    { q: "Solve: ∫ sinh x dx", correct: "cosh x + C", language: { tamil: "∫ sinh x dx" }, type: "fillInTheBlank" },
    { q: "Find ∫ sec x dx", correct: "ln|sec x + tan x| + C", language: { tamil: "∫ sec x dx" }, type: "fillInTheBlank" },
    { q: "If A = [[4,0],[0,9]], find eigenvalues", correct: "4,9", options: ["4,9", "2,3", "0,1", "3,9"], language: { tamil: "[[4,0],[0,9]]-இன் eigenvalues" }, type: "dragAndDrop" },
    { q: "Differentiate: d/dx (x^n)", correct: "n*x^(n-1)", language: { tamil: "d/dx (x^n)" }, type: "fillInTheBlank" },
    { q: "Find derivative of sinh x", correct: "cosh x", options: ["cosh x", "sinh x", "-cosh x", "-sinh x"], language: { tamil: "sinh x-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Find derivative of cosh x", correct: "sinh x", options: ["cosh x", "sinh x", "-cosh x", "-sinh x"], language: { tamil: "cosh x-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Integrate: ∫ dx/(1+x²)", correct: "tan⁻¹x + C", language: { tamil: "∫ dx/(1+x²)" }, type: "fillInTheBlank" },
    { q: "Integrate: ∫ dx/(√(a²–x²))", correct: "sin⁻¹(x/a) + C", language: { tamil: "∫ dx/(√(a²–x²))" }, type: "fillInTheBlank" },
    { q: "Find derivative of sec x", correct: "sec x tan x", options: ["sec x tan x", "cos x", "-sec x tan x", "tan x"], language: { tamil: "sec x-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Find derivative of cosec x", correct: "-cosec x cot x", options: ["cosec x cot x", "-cosec x cot x", "-sin x", "cos x"], language: { tamil: "cosec x-இன் வகைக்கெழு" }, type: "dragAndDrop" },
    { q: "Solve: ∫ dx/(x²–1)", correct: "(1/2) ln|(x–1)/(x+1)| + C", language: { tamil: "∫ dx/(x²–1)" }, type: "fillInTheBlank" },
    { q: "Find derivative of log|x|", correct: "1/x", language: { tamil: "log|x|-இன் வகைக்கெழு" }, type: "fillInTheBlank" },
    { q: "Limit x→0 (1–cos x)/x²", correct: "1/2", options: ["0", "1/2", "1", "∞"], language: { tamil: "x→0 (1–cos x)/x²-இன் வரம்பு" }, type: "dragAndDrop" },
    { q: "Evaluate: ∫ dx/(√(x²–a²))", correct: "ln|x + √(x²–a²)| + C", language: { tamil: "∫ dx/(√(x²–a²))" }, type: "fillInTheBlank" },
    { q: "If A = [[1,1],[1,1]], find rank(A)", correct: "1", options: ["0", "1", "2", "∞"], language: { tamil: "[[1,1],[1,1]]-இன் rank" }, type: "dragAndDrop" },
    { q: "Find eigenvalues of [[2,1],[1,2]]", correct: "3,1", options: ["2,2", "3,1", "1,1", "0,3"], language: { tamil: "[[2,1],[1,2]]-இன் eigenvalues" }, type: "dragAndDrop" },
    { q: "If y = e^(2x), find dy/dx", correct: "2e^(2x)", language: { tamil: "y = e^(2x) என்றால், dy/dx" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (tan⁻¹(2x))", correct: "2/(1+4x²)", language: { tamil: "d/dx (tan⁻¹(2x))" }, type: "fillInTheBlank" },
    { q: "Evaluate: ∫ x e^x dx", correct: "(x–1)e^x + C", language: { tamil: "∫ x e^x dx" }, type: "fillInTheBlank" },
    { q: "If f(x) = |x|, what is f'(0)?", correct: "Does not exist", options: ["0", "1", "–1", "Does not exist"], language: { tamil: "f(x) = |x| என்றால், f'(0)" }, type: "dragAndDrop" },
    { q: "Find limit x→0 (sin 3x / x)", correct: "3", options: ["0", "1", "3", "∞"], language: { tamil: "x→0 (sin 3x / x)-இன் வரம்பு" }, type: "dragAndDrop" },
    { q: "Evaluate: ∫ dx/(a²+x²)", correct: "(1/a) tan⁻¹(x/a) + C", language: { tamil: "∫ dx/(a²+x²)" }, type: "fillInTheBlank" },
    { q: "Find derivative of x^x", correct: "x^x(1+ln x)", language: { tamil: "x^x-இன் வகைக்கெழு" }, type: "fillInTheBlank" },
    { q: "If f(x) = cos⁻¹x, find f'(x)", correct: "-1/√(1–x²)", language: { tamil: "f(x) = cos⁻¹x என்றால், f'(x)" }, type: "fillInTheBlank" },
    { q: "Solve: ∫ sec²x dx", correct: "tan x + C", language: { tamil: "∫ sec²x dx" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (logₐx)", correct: "1/(x ln a)", language: { tamil: "d/dx (logₐx)" }, type: "fillInTheBlank" },
    { q: "Find eigenvalues of [[1,0,0],[0,2,0],[0,0,3]]", correct: "1,2,3", options: ["1,2,3", "0,1,2", "2,3,3", "1,1,2"], language: { tamil: "[[1,0,0],[0,2,0],[0,0,3]]-இன் eigenvalues" }, type: "dragAndDrop" },
    { q: "Find derivative of ln(sin x)", correct: "cot x", language: { tamil: "ln(sin x)-இன் வகைக்கெழு" }, type: "fillInTheBlank" }
  ],
};

// Utility function to shuffle arrays
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Canvas Confetti Component
const CanvasConfetti = ({ isActive, onComplete }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const confettiPieces = useRef([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create confetti pieces
    confettiPieces.current = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const shapes = ['square', 'circle', 'triangle'];

    for (let i = 0; i < 150; i++) {
      confettiPieces.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        gravity: 0.3,
        life: 100
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.current = confettiPieces.current.filter(piece => {
        // Update physics
        piece.vy += piece.gravity;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.rotationSpeed;
        piece.life--;

        // Bounce off walls
        if (piece.x < 0 || piece.x > canvas.width) {
          piece.vx *= -0.8;
          piece.x = Math.max(0, Math.min(canvas.width, piece.x));
        }

        // Remove if off screen or life expired
        if (piece.y > canvas.height + 50 || piece.life <= 0) {
          return false;
        }

        // Draw the piece
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.globalAlpha = Math.max(0, piece.life / 100);

        switch (piece.shape) {
          case 'square':
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -piece.size / 2);
            ctx.lineTo(-piece.size / 2, piece.size / 2);
            ctx.lineTo(piece.size / 2, piece.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }
        ctx.restore();

        return true;
      });

      if (confettiPieces.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete && onComplete();
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  );
};

// Enhanced Motivational Quotes
const motivationalQuotes = [
  "Don't worry, every mistake is a learning opportunity!",
  "You've got this! Keep trying!",
  "The only way to fail is to give up. You're doing great!",
  "Success is not final, failure is not fatal: it is the courage to continue that counts!",
  "Practice makes perfect! You're getting better!",
  "Every expert was once a beginner. Keep going!"
];

const tamilMotivationalQuotes = [
  "கவலைப்பட வேண்டாம்! ஒவ்வொரு தவறும் கற்றலின் வாய்ப்பு!",
  "தொடர்ந்து முயற்சி செய்யுங்கள்! நீங்கள் நன்றாக செய்கிறீர்கள்!",
  "கணிதம் ஒரு புதிர் போல - பயிற்சி செய்தால் தீர்வு கிடைக்கும்!",
  "நீங்கள் அருமையாக செய்கிறீர்கள்! ஒவ்வொரு அடியாக!",
  "பயிற்சியே வெற்றிக்கு வழி! நீங்கள் மேம்பட்டு வருகிறீர்கள்!",
  "ஒவ்வொரு நிபுணரும் ஒரு காலத்தில் ஆரம்பநிலையாளராக இருந்தார்கள்!"
];

// Enhanced Feedback component
const QuizFeedback = ({ message, type, correctAnswer, language, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const isCorrect = type === 'correct';

  useEffect(() => {
    if (isCorrect) {
      setShowConfetti(true);
    }
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isCorrect, onClose]);

  return (
    <>
      <CanvasConfetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 999,
        pointerEvents: 'none'
      }}>
        <div style={{
          background: isCorrect ? '#10b981' : '#ef4444',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `4px solid ${isCorrect ? '#059669' : '#dc2626'}`,
          backdropFilter: 'blur(10px)',
          maxWidth: '90%',
          textAlign: 'center',
          animation: 'bounceIn 0.6s ease-out',
          pointerEvents: 'auto'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            color: 'white',
            marginBottom: '1rem',
            animation: isCorrect ? 'pulse 1s infinite' : 'none'
          }}>
            {isCorrect ? '✅' : '❌'}
          </div>
          <p style={{ 
            fontWeight: 'bold', 
            fontSize: '1.25rem', 
            color: 'white',
            marginBottom: correctAnswer ? '1rem' : '0'
          }}>
            {message}
          </p>
          {correctAnswer && (
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem'
            }}>
              {language === 'english' ? `Correct Answer: ${correctAnswer}` : `சரியான விடை: ${correctAnswer}`}
            </p>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

// Main App Component
export default function MathQuiz() {
  const { user, addScore } = useUser();

  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [language, setLanguage] = useState("english");
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTestActive, setIsTestActive] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [droppedAnswer, setDroppedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  // Touch support states
  const [draggedItem, setDraggedItem] = useState(null);
  const [touchStarted, setTouchStarted] = useState(false);

  const t = translations[language];

  // Enhanced next question handler
  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setAnswerSubmitted(false);
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setIsTestActive(false);
      setCurrentScreen("results");
      const endTime = Date.now();
      const totalTime = Math.floor((endTime - gameStartTime) / 1000);
      setTotalTimeTaken(totalTime);
      
      if (user) {
        const maxPossibleScore = shuffledQuestions.length;
        const finalScore = score;
        
        let difficultyMultiplier = 1;
        if (selectedLevel === 'intermediate') difficultyMultiplier = 1.2;
        if (selectedLevel === 'advanced') difficultyMultiplier = 1.5;
        
        const adjustedScore = Math.round(finalScore * difficultyMultiplier);
        const maxAdjustedScore = Math.round(maxPossibleScore * difficultyMultiplier);
        
        addScore(
          'mathQuiz',
          adjustedScore,
          maxAdjustedScore,
          totalTime,
          selectedLevel
        );
      }
    }
  }, [currentQuestionIndex, shuffledQuestions.length, score, selectedLevel, gameStartTime, user, addScore]);

  const handleFeedbackClose = useCallback(() => {
    setTimeout(() => {
      handleNextQuestion();
    }, 500);
  }, [handleNextQuestion]);

  // Timer effect
  useEffect(() => {
    if (!isTestActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isTestActive && !answerSubmitted) {
        setFeedback({ 
          message: language === 'english' ? "Time's up!" : "நேரம் முடிந்துவிட்டது!", 
          type: 'incorrect' 
        });
        setTimeout(() => handleNextQuestion(), 2500);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isTestActive, answerSubmitted, handleNextQuestion, language]);

  // Reset question state
  useEffect(() => {
    if (currentScreen === 'test' && shuffledQuestions.length > 0) {
      const currentQ = shuffledQuestions[currentQuestionIndex];
      setAnswerSubmitted(false);
      
      if (currentQ.type === 'dragAndDrop') {
        setShuffledOptions(shuffleArray(currentQ.options));
        setDroppedAnswer(null);
      } else if (currentQ.type === 'sequencing') {
        setAvailableOptions(shuffleArray(currentQ.options));
        setSelectedSequence([]);
      } else if (currentQ.type === 'fillInTheBlank') {
        setInputAnswer("");
      }
    }
  }, [currentQuestionIndex, currentScreen, shuffledQuestions]);

  // Start test function
  const startTest = (level) => {
    setSelectedLevel(level);
    setCurrentScreen("test");
    const levelQuestions = questionBank[level];
    const questionsToUse = Math.min(8, levelQuestions.length);
    setShuffledQuestions(shuffleArray(levelQuestions).slice(0, questionsToUse));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setIsTestActive(true);
    setFeedback(null);
    setSelectedSequence([]);
    setDroppedAnswer(null);
    setInputAnswer("");
    setAnswerSubmitted(false);
    setGameStartTime(Date.now());
  };

  // Answer checking
  const handleCheckAnswer = () => {
    if (answerSubmitted) return;
    
    const currentQ = shuffledQuestions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQ.type === 'dragAndDrop') {
      if (!droppedAnswer) return;
      isCorrect = droppedAnswer.toString().toLowerCase() === currentQ.correct.toString().toLowerCase();
    } else if (currentQ.type === 'sequencing') {
      if (selectedSequence.length === 0) return;
      isCorrect = JSON.stringify(selectedSequence) === JSON.stringify(currentQ.correct);
    } else if (currentQ.type === 'fillInTheBlank') {
      if (!inputAnswer.trim()) return;
      isCorrect = inputAnswer.trim().toLowerCase() === currentQ.correct.toString().toLowerCase();
    }

    setAnswerSubmitted(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ message: language === 'english' ? "Correct! Well done!" : "சரி! நல்லது!", type: 'correct' });
    } else {
      const quotes = language === 'english' ? motivationalQuotes : tamilMotivationalQuotes;
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      setFeedback({ message: quote, type: 'incorrect', correctAnswer: currentQ.correct });
    }
  };

  // Enhanced drag and drop handlers with touch support
  const onDragStart = (e, data) => {
    e.dataTransfer.setData("text/plain", data);
    setDraggedItem(data);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDropSingle = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setDroppedAnswer(data);
    setDraggedItem(null);
  };

  const onDropSequence = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setSelectedSequence(prev => {
      if (!prev.includes(data)) {
        return [...prev, data];
      }
      return prev;
    });
    setAvailableOptions(prev => prev.filter(opt => opt !== data));
    setDraggedItem(null);
  };

  // Touch event handlers
  const handleTouchStart = (e, data) => {
    e.preventDefault();
    setDraggedItem(data);
    setTouchStarted(true);
  };

  const handleTouchEnd = (e, dropZoneType) => {
    e.preventDefault();
    if (!draggedItem || !touchStarted) return;

    if (dropZoneType === 'single') {
      setDroppedAnswer(draggedItem);
    } else if (dropZoneType === 'sequence') {
      setSelectedSequence(prev => {
        if (!prev.includes(draggedItem)) {
          return [...prev, draggedItem];
        }
        return prev;
      });
      setAvailableOptions(prev => prev.filter(opt => opt !== draggedItem));
    }

    setDraggedItem(null);
    setTouchStarted(false);
  };

  // Touch-enabled option click for mobile
  const handleOptionClick = (option, type) => {
    if (answerSubmitted) return;
    
    if (type === 'dragAndDrop') {
      setDroppedAnswer(option);
    } else if (type === 'sequencing') {
      setSelectedSequence(prev => {
        if (!prev.includes(option)) {
          return [...prev, option];
        }
        return prev;
      });
      setAvailableOptions(prev => prev.filter(opt => opt !== option));
    }
  };

  const removeFromSequence = (index) => {
    const removedItem = selectedSequence[index];
    setSelectedSequence(prev => prev.filter((_, i) => i !== index));
    setAvailableOptions(prev => [...prev, removedItem]);
  };

  const resetGame = () => {
    setCurrentScreen("home");
    setSelectedLevel(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsTestActive(false);
    setFeedback(null);
    setTotalTimeTaken(0);
    setGameStartTime(null);
  };

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    overflow: 'hidden'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  };

  // Home Screen
  if (currentScreen === "home") {
    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem'
      }}>
        <div style={{
          ...cardStyle,
          padding: '2rem 1.5rem',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            {t.title}
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            {language === 'english' 
              ? "Challenge yourself with interactive math problems!"
              : "ஊடாடும் கணிதச் சிக்கல்களுடன் உங்களை சவால் செய்யுங்கள்!"
            }
          </p>
          
          <button 
            onClick={() => setLanguage(language === "english" ? "tamil" : "english")}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '2rem',
              marginBottom: '2rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            🌐 {t.languageButton}
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { level: "beginner", color: '#10b981', emoji: '🟢', desc: 'Basic arithmetic' },
              { level: "intermediate", color: '#f59e0b', emoji: '🟡', desc: 'Algebra & statistics' },
              { level: "advanced", color: '#ef4444', emoji: '🔴', desc: 'Calculus & advanced' }
            ].map(({ level, color, emoji, desc }) => (
              <button 
                key={level}
                onClick={() => startTest(level)} 
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: `${color}dd`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {emoji} {t[level]}
                <div style={{ fontSize: '0.75rem', opacity: '0.9', marginTop: '0.25rem' }}>
                  {language === 'english' ? desc : 
                    level === 'beginner' ? 'அடிப்படை கணிதம்' :
                    level === 'intermediate' ? 'இயற்கணிதம்' : 'கலன்'
                  }
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Test Screen
  if (currentScreen === "test" && shuffledQuestions.length > 0) {
    const q = shuffledQuestions[currentQuestionIndex];
    const questionText = (language === "tamil" && q.language?.tamil) ? q.language.tamil : q.q;
    const backgrounds = {
      beginner: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      intermediate: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      advanced: 'linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)'
    };

    return (
      <div style={{
        ...containerStyle,
        background: backgrounds[selectedLevel],
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: timeLeft <= 10 ? '#ebe6e6ff' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0rem 0rem',
            borderRadius: '1.5rem',
            animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none'
          }}>
            
          </div>
        
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: timeLeft <= 10 ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '1.5rem',
            animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none'
          }}>
            ⏰ {timeLeft}s
          </div>
          
          <button 
            onClick={() => setLanguage(language === "english" ? "tamil" : "english")}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            தமிழ் / English
          </button>
          <button 
            onClick={() => {
              setIsTestActive(false);
              setCurrentScreen("home");
            }}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}
          >
            Back to levels
          </button>
          
        </div>

        {/* Question Card */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            ...cardStyle,
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              opacity: '0.9'
            }}>
              {t.question} {currentQuestionIndex + 1}/{shuffledQuestions.length}
            </div>
            
            <h2 style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1.5rem',
              lineHeight: '1.3'
            }}>
              {questionText}
            </h2>
            
            {q.type === 'dragAndDrop' && (
              <div>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1rem'
                }}>
                  {t.selectAnswerPrompt}
                </p>
                
                <div
                  onDragOver={onDragOver}
                  onDrop={onDropSingle}
                  onTouchEnd={(e) => handleTouchEnd(e, 'single')}
                  style={{
                    height: '3rem',
                    border: '2px dashed rgba(255, 255, 255, 0.5)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    background: droppedAnswer ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    minHeight: '60px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {droppedAnswer ? (
                    <div style={{
                      background: 'white',
                      color: '#374151',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600'
                    }}>
                      {droppedAnswer}
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                      {language === 'english' ? 'Drop or tap answer here' : 'விடையை இங்கே விடவும் அல்லது தட்டவும்'}
                    </span>
                  )}
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '0.75rem' 
                }}>
                  {shuffledOptions.map((opt, i) => (
                    <div
                      key={i}
                      draggable={!answerSubmitted}
                      onDragStart={(e) => onDragStart(e, opt)}
                      onTouchStart={(e) => handleTouchStart(e, opt)}
                      onClick={() => handleOptionClick(opt, 'dragAndDrop')}
                      style={{
                        padding: '0.75rem',
                        background: draggedItem === opt ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        cursor: answerSubmitted ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        opacity: answerSubmitted ? '0.6' : '1',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        transform: draggedItem === opt ? 'scale(0.95)' : 'scale(1)',
                        border: draggedItem === opt ? '2px solid white' : '2px solid transparent'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {q.type === 'sequencing' && (
              <div>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '1rem'
                }}>
                  {t.sequencePrompt}
                </p>
                
                <div
                  onDragOver={onDragOver}
                  onDrop={onDropSequence}
                  onTouchEnd={(e) => handleTouchEnd(e, 'sequence')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    border: '2px dashed rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {selectedSequence.length > 0 ? (
                    selectedSequence.map((step, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span><strong>{index + 1}.</strong> {step}</span>
                        {!answerSubmitted && (
                          <button
                            onClick={() => removeFromSequence(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      padding: '2rem 0'
                    }}>
                      {language === 'english' ? 'Drop or tap steps here in order' : 'படிநிலைகளை வரிசையாக இங்கே விடவும் அல்லது தட்டவும்'}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {availableOptions.map((opt, i) => (
                    <div
                      key={i}
                      draggable={!answerSubmitted}
                      onDragStart={(e) => onDragStart(e, opt)}
                      onTouchStart={(e) => handleTouchStart(e, opt)}
                      onClick={() => handleOptionClick(opt, 'sequencing')}
                      style={{
                        padding: '0.5rem',
                        background: draggedItem === opt ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        cursor: answerSubmitted ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        opacity: answerSubmitted ? '0.6' : '1',
                        transition: 'all 0.3s ease',
                        transform: draggedItem === opt ? 'scale(0.95)' : 'scale(1)',
                        border: draggedItem === opt ? '2px solid white' : '2px solid transparent'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    if (!answerSubmitted) {
                      setSelectedSequence([]);
                      setAvailableOptions(shuffleArray(q.options));
                    }
                  }}
                  disabled={answerSubmitted}
                  style={{
                    padding: '0.5rem 1rem',
                    background: answerSubmitted ? 'rgba(107, 114, 128, 0.5)' : 'rgba(107, 114, 128, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: answerSubmitted ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  🔄 {t.clearSequence}
                </button>
              </div>
            )}

            {q.type === 'fillInTheBlank' && (
              <div>
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
                  disabled={answerSubmitted}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    outline: 'none'
                  }}
                  placeholder={language === 'english' ? 'Type your answer...' : 'உங்கள் பதிலை தட்டச்சு செய்யவும்...'}
                />
              </div>
            )}
            
            <button 
              onClick={handleCheckAnswer}
              disabled={answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: (answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)) 
                  ? 'rgba(107, 114, 128, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: (answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)) 
                  ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                opacity: (answerSubmitted || (!droppedAnswer && !inputAnswer.trim() && selectedSequence.length === 0)) ? '0.6' : '1'
              }}
            >
              ✓ {t.checkAnswer}
            </button>
          </div>
        </div>
        
        {feedback && (
          <QuizFeedback 
            message={feedback.message} 
            type={feedback.type} 
            correctAnswer={feedback.correctAnswer} 
            language={language}
            onClose={handleFeedbackClose}
          />
        )}
      </div>
    );
  }

  // Results Screen
  if (currentScreen === "results") {
    const totalQuestions = shuffledQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const isHighScore = score >= totalQuestions * 0.8;
    const isMediumScore = score >= totalQuestions * 0.6;

    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4c1d95 0%, #7c2d12 50%, #be185d 100%)',
        padding: '1rem'
      }}>
        <div style={{
          ...cardStyle,
          padding: '2rem 1.5rem',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1.5rem', fontSize: '4rem' }}>
            {isHighScore ? '🏆' : isMediumScore ? '🎖' : '📚'}
          </div>
          
          <h1 style={{
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            {isHighScore ? t.starPerformerTitle : isMediumScore ? t.achieverTitle : t.needsPracticeTitle}
          </h1>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              {score}/{totalQuestions}
            </div>
            <div style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1rem'
            }}>
              {percentage}%
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                borderRadius: '4px',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            {language === 'english' 
              ? (isHighScore ? "Outstanding performance! You're a math superstar!" :
                 isMediumScore ? "Great work! You're making excellent progress!" :
                 "Keep practicing! Every expert was once a beginner!")
              : (isHighScore ? "அருமையான செயல்திறன்! நீங்கள் ஒரு கணித சூப்பர் ஸ்டார்!" :
                 isMediumScore ? "நல்லது! நீங்கள் சிறப்பான முன்னேற்றம் அடைந்து வருகிறீர்கள்!" :
                 "தொடர்ந்து பயிற்சி செய்யுங்கள்! ஒவ்வொரு நிபுணரும் ஒரு காலத்தில் ஆரம்பநிலையாளராக இருந்தார்கள்!")
            }
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => startTest(selectedLevel)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3b82f6dd',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              🔄 {t.retry}
            </button>
            <button 
              onClick={() => setCurrentScreen("home")}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#10b981dd',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              🏠 {t.home}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        input {
          user-select: text;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
          touch-action: manipulation;
        }
        
        [draggable="true"] {
          touch-action: none;
        }
        
        .drag-item {
          transition: all 0.3s ease;
        }
        
        .drag-item:active {
          transform: scale(0.95);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
