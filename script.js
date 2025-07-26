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
        question: "when making plans with friends, who usually gets things started?",
        leftExtreme: "i wait for others to plan",
        rightExtreme: "i'm the one who plans",
        note: "extraversion"
    },
    {
        question: "how do you prefer to work on projects?",
        leftExtreme: "i work best alone",
        rightExtreme: "i work best with others",
        note: "extraversion"
    },
    {
        question: "when making decisions, what guides you more?",
        leftExtreme: "i analyze everything logically",
        rightExtreme: "i trust my gut feeling",
        note: "emotional stability"
    },
    {
        question: "how much do you share about your feelings with close friends?",
        leftExtreme: "i keep feelings private",
        rightExtreme: "i share everything openly",
        note: "emotional stability"
    },
    {
        question: "how do you feel about trying food you've never had before?",
        leftExtreme: "i stick to what i know",
        rightExtreme: "i love trying new things",
        note: "adventurousness"
    },
    {
        question: "how do you feel about trying new apps or gadgets?",
        leftExtreme: "i stick with what works",
        rightExtreme: "i love the latest tech",
        note: "adventurousness"
    },
    {
        question: "when someone needs to hear hard truths, how do you handle it?",
        leftExtreme: "i try to be subtle",
        rightExtreme: "i'm comfortable being direct",
        note: "authenticity"
    },
    {
        question: "when introducing myself to new people, i tend to...",
        leftExtreme: "downplay my achievements",
        rightExtreme: "highlight my accomplishments",
        note: "authenticity"
    },
    {
        question: "how do you handle commitments you've made that are no longer convenient?",
        leftExtreme: "i follow through no matter what",
        rightExtreme: "i cancel",
        note: "conscientiousness"
    },
    {
        question: "when planning a weekend trip, i usually...",
        leftExtreme: "wing it",
        rightExtreme: "create a detailed itinerary",
        note: "conscientiousness"
    },
    {
        question: "how often do you give feedback when you see room for improvement?",
        leftExtreme: "i keep thoughts to myself",
        rightExtreme: "i share feedback openly",
        note: "agreeableness"
    },
    {
        question: "when your needs conflict with helping someone, what comes first?",
        leftExtreme: "i help others first",
        rightExtreme: "i take care of myself first",
        note: "agreeableness"
    }
    // {
    //     question: "how do you keep track of things you need to do?",
    //     leftExtreme: "i go with the flow",
    //     rightExtreme: "i plan every detail",
    //     note: "conscientiousness"
    // },
];

const freeResponseQuestions = [
    "my ideal tuesday in 5 years looks like...",
    "one hill i'd die on is...",
    "the person i'm closest to is...",
    "a movie character i resonate with is...",
    "younger me would never believe that i now..."
];

// Survey State
let currentStep = 'name'; // 'name', 'selection', 'freeresponse', 'thankyou'
let currentSelectionIndex = 0;
let currentFreeResponseIndex = 0;
let randomizedSelectionQuestions = [];

// Supabase Configuration
const SUPABASE_URL = 'https://fadvhiyjwyysqdustjhk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZHZoaXlqd3l5c3FkdXN0amhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjc4MDMsImV4cCI6MjA2ODgwMzgwM30.8O35YVEgB0sPg1M-nDkC9voQgjGAPZhp9v3ooQyNRN8';

// DOM Elements
const nameScreen = document.getElementById('name-screen');
const selectionScreen = document.getElementById('selection-screen');
const freeResponseScreen = document.getElementById('freeresponse-screen');
const thankYouScreen = document.getElementById('thankyou-screen');

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize Survey
document.addEventListener('DOMContentLoaded', function() {
    // Randomize selection questions order
    randomizedSelectionQuestions = shuffleArray(selectionQuestions);
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
    if (currentSelectionIndex >= randomizedSelectionQuestions.length) {
        // Skip free response questions and go directly to submit
        submitSurveyData();
        return;
    }
    
    const question = randomizedSelectionQuestions[currentSelectionIndex];
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
    const originalQuestionIndex = selectionQuestions.indexOf(randomizedSelectionQuestions[currentSelectionIndex]);
    
    // Update UI
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Store answer using original question index to maintain traceability
    surveyData.selectionAnswers[originalQuestionIndex] = value;
    
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
            surveyVersion: "1.1", // Version tracking for data analysis
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