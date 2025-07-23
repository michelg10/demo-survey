// Survey Data and Configuration
const surveyData = {
    firstName: '',
    lastName: '',
    selectionAnswers: {},
    freeResponseAnswers: {}
};

// Questions Data
const selectionQuestions = [
    {
        question: "when making plans, how often do you initiate social activities?",
        leftExtreme: "wait for others to plan",
        rightExtreme: "always organize events"
    },
    {
        question: "how excited are you about trying foods from cultures you've never experienced?",
        leftExtreme: "prefer familiar foods",
        rightExtreme: "eager to try anything new"
    },
    {
        question: "how detailed are your to-do lists and planning systems?",
        leftExtreme: "prefer spontaneous decisions",
        rightExtreme: "meticulously plan everything"
    },
    {
        question: "how comfortable are you having difficult conversations with friends or colleagues?",
        leftExtreme: "extremely uncomfortable",
        rightExtreme: "very comfortable"
    },
    {
        question: "how much do you rely on gut feelings versus logical analysis when making choices?",
        leftExtreme: "pure logical analysis",
        rightExtreme: "pure intuition"
    },
    {
        question: "how comfortable are you giving constructive feedback to peers?",
        leftExtreme: "avoid giving feedback",
        rightExtreme: "regularly offer guidance"
    },
    {
        question: "how excited are you about implementing new technologies in your daily routine?",
        leftExtreme: "prefer established tools",
        rightExtreme: "love trying latest innovations"
    },
    {
        question: "how openly do you share your feelings with close friends?",
        leftExtreme: "keep emotions private",
        rightExtreme: "share feelings freely"
    },
    {
        question: "how much do you enjoy working independently versus in teams?",
        leftExtreme: "strongly prefer working alone",
        rightExtreme: "strongly prefer teamwork"
    },
    {
        question: "when faced with competing priorities, how do you balance personal goals with helping others?",
        leftExtreme: "always help others first",
        rightExtreme: "focus on personal goals first"
    }
];

const freeResponseQuestions = [
    "where do you see yourself in 5 years?",
    "one hill i'd die on: (non-negotiable traits)",
    "who is the person that has been the closest with you and why?",
    "what movie character do you secretly channel? in what scene?",
    "past me would be proud that i now..."
];

// Survey State
let currentStep = 'name'; // 'name', 'selection', 'freeresponse', 'thankyou'
let currentSelectionIndex = 0;
let currentFreeResponseIndex = 0;

// Supabase Configuration
const SUPABASE_URL = 'https://fadvhiyjwyysqdustjhk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZHZoaXlqd3l5c3FkdXN0amhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjc4MDMsImV4cCI6MjA2ODgwMzgwM30.8O35YVEgB0sPg1M-nDkC9voQgjGAPZhp9v3ooQyNRN8';

// DOM Elements
const nameScreen = document.getElementById('name-screen');
const selectionScreen = document.getElementById('selection-screen');
const freeResponseScreen = document.getElementById('freeresponse-screen');
const thankYouScreen = document.getElementById('thankyou-screen');

// Initialize Survey
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showScreen('name');
});

function setupEventListeners() {
    // Name screen
    document.getElementById('name-continue').addEventListener('click', handleNameContinue);
    
    // Selection screen - scale buttons
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.addEventListener('click', handleScaleSelection);
    });
    
    // Free response screen
    document.getElementById('freeresponse-continue').addEventListener('click', handleFreeResponseContinue);
}

function showScreen(screenType) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    switch(screenType) {
        case 'name':
            nameScreen.classList.add('active');
            break;
        case 'selection':
            selectionScreen.classList.add('active');
            displaySelectionQuestion();
            break;
        case 'freeresponse':
            freeResponseScreen.classList.add('active');
            displayFreeResponseQuestion();
            break;
        case 'thankyou':
            thankYouScreen.classList.add('active');
            break;
    }
}

function handleNameContinue() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    
    if (!firstName || !lastName) {
        alert('please enter both your first and last name');
        return;
    }
    
    surveyData.firstName = firstName;
    surveyData.lastName = lastName;
    
    currentStep = 'selection';
    currentSelectionIndex = 0;
    showScreen('selection');
}

function displaySelectionQuestion() {
    if (currentSelectionIndex >= selectionQuestions.length) {
        // Move to free response questions
        currentStep = 'freeresponse';
        currentFreeResponseIndex = 0;
        showScreen('freeresponse');
        return;
    }
    
    const question = selectionQuestions[currentSelectionIndex];
    document.getElementById('selection-question').textContent = question.question;
    document.getElementById('left-extreme').textContent = question.leftExtreme;
    document.getElementById('right-extreme').textContent = question.rightExtreme;
    
    // Clear previous selections
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function handleScaleSelection(event) {
    const value = parseInt(event.target.dataset.value);
    const questionIndex = currentSelectionIndex;
    
    // Update UI
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Store answer
    surveyData.selectionAnswers[questionIndex] = value;
    
    // Auto-advance after short delay
    setTimeout(() => {
        currentSelectionIndex++;
        displaySelectionQuestion();
    }, 300);
}

function displayFreeResponseQuestion() {
    if (currentFreeResponseIndex >= freeResponseQuestions.length) {
        // Submit data and show thank you
        submitSurveyData();
        return;
    }
    
    const question = freeResponseQuestions[currentFreeResponseIndex];
    document.getElementById('freeresponse-question').textContent = question;
    
    // Clear previous input
    document.getElementById('freeresponse-input').value = '';
    document.getElementById('freeresponse-input').focus();
}

function handleFreeResponseContinue() {
    const answer = document.getElementById('freeresponse-input').value.trim();
    
    if (!answer) {
        alert('please provide an answer before continuing');
        return;
    }
    
    // Store answer
    surveyData.freeResponseAnswers[currentFreeResponseIndex] = answer;
    
    currentFreeResponseIndex++;
    displayFreeResponseQuestion();
}

async function submitSurveyData() {
    try {
        // Prepare data for submission
        const submissionData = {
            timestamp: new Date().toISOString(),
            firstName: surveyData.firstName,
            lastName: surveyData.lastName,
            selectionAnswers: surveyData.selectionAnswers,
            freeResponseAnswers: surveyData.freeResponseAnswers
        };
        
        // Convert to JSON string as specified
        const jsonData = JSON.stringify(submissionData);
        
        // Submit to Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/survey_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                data: jsonData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Survey data submitted successfully');
        
    } catch (error) {
        console.error('Error submitting survey data:', error);
        // Show thank you screen anyway to not frustrate user
    }
    
    // Show thank you screen
    currentStep = 'thankyou';
    showScreen('thankyou');
}

// Keyboard navigation for better UX
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (currentStep === 'name') {
            handleNameContinue();
        } else if (currentStep === 'freeresponse') {
            handleFreeResponseContinue();
        }
    }
    
    // Number keys for selection questions
    if (currentStep === 'selection' && event.key >= '1' && event.key <= '7') {
        const btnValue = event.key;
        const btn = document.querySelector(`[data-value="${btnValue}"]`);
        if (btn) {
            btn.click();
        }
    }
});