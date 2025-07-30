// Survey Data and Configuration
const surveyData = {
    firstName: '',
    lastName: '',
    selectionAnswers: {},
    freeResponseAnswers: {},
    referral: '',
    relationshipType: '',
    friendshipReasons: [],
    closenessRating: null
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
let currentStep = 'name'; // 'name', 'selection', 'freeresponse', 'referral', 'relationship', 'ranking', 'closeness', 'thankyou'
let currentSelectionIndex = 0;
let currentFreeResponseIndex = 0;
let randomizedSelectionQuestions = [];
let navigationHistory = [];

// Supabase Configuration
const SUPABASE_URL = 'https://fadvhiyjwyysqdustjhk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZHZoaXlqd3l5c3FkdXN0amhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjc4MDMsImV4cCI6MjA2ODgwMzgwM30.8O35YVEgB0sPg1M-nDkC9voQgjGAPZhp9v3ooQyNRN8';

// DOM Elements
const nameScreen = document.getElementById('name-screen');
const selectionScreen = document.getElementById('selection-screen');
const freeResponseScreen = document.getElementById('freeresponse-screen');
const referralScreen = document.getElementById('referral-screen');
const relationshipScreen = document.getElementById('relationship-screen');
const rankingScreen = document.getElementById('ranking-screen');
const closenessScreen = document.getElementById('closeness-screen');
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
    showScreen('name', false); // Don't add first screen to history
});

function setupEventListeners() {
    // Name screen
    document.getElementById('name-continue').addEventListener('click', handleNameContinue);
    
    // Selection screen - scale buttons
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.addEventListener('click', handleScaleSelection);
    });
    
    // Back buttons
    document.getElementById('selection-back').addEventListener('click', handleSelectionBack);
    document.getElementById('freeresponse-back').addEventListener('click', handleFreeResponseBack);
    
    // Free response screen
    document.getElementById('freeresponse-continue').addEventListener('click', handleFreeResponseContinue);
    
    // Referral screen
    document.getElementById('referral-continue').addEventListener('click', handleReferralContinue);
    document.getElementById('referral-back').addEventListener('click', handleReferralBack);
    
    // Relationship screen
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', handleRelationshipChoice);
    });
    document.getElementById('relationship-back').addEventListener('click', handleRelationshipBack);
    
    // Ranking screen
    document.getElementById('ranking-continue').addEventListener('click', handleRankingContinue);
    document.getElementById('ranking-back').addEventListener('click', handleRankingBack);
    setupDragAndDrop();
    
    // Closeness screen
    document.querySelectorAll('.closeness-btn').forEach(btn => {
        btn.addEventListener('click', handleClosenessChoice);
    });
    document.getElementById('closeness-back').addEventListener('click', handleClosenessBack);
}

function showScreen(screenType, addToHistory = true) {
    // Add current screen to history (but not if we're going back)
    if (addToHistory && currentStep) {
        navigationHistory.push({
            step: currentStep,
            selectionIndex: currentSelectionIndex,
            freeResponseIndex: currentFreeResponseIndex
        });
    }
    
    // Update current step
    currentStep = screenType;
    
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
        case 'referral':
            referralScreen.classList.add('active');
            document.getElementById('referral-input').focus();
            break;
        case 'relationship':
            relationshipScreen.classList.add('active');
            updateRelationshipReferralName();
            break;
        case 'ranking':
            rankingScreen.classList.add('active');
            break;
        case 'closeness':
            closenessScreen.classList.add('active');
            updateClosenessReferralName();
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
    
    currentSelectionIndex = 0;
    showScreen('selection');
}

function displaySelectionQuestion() {
    if (currentSelectionIndex >= randomizedSelectionQuestions.length) {
        // INTENTIONALLY SKIPPING FREE RESPONSE QUESTIONS FOR NOW
        // Move directly to referral questions (moved from beginning)
        showScreen('referral');
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
    
    // Restore previous answer if it exists
    const previousAnswer = surveyData.selectionAnswers[question.question];
    if (previousAnswer) {
        const previousBtn = document.querySelector(`[data-value="${previousAnswer}"]`);
        if (previousBtn) {
            previousBtn.classList.add('selected');
        }
    }
}

function handleScaleSelection(event) {
    const value = parseInt(event.target.dataset.value);
    const currentQuestion = randomizedSelectionQuestions[currentSelectionIndex];
    
    // Update UI
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Store answer using question text as key for perfect traceability
    surveyData.selectionAnswers[currentQuestion.question] = value;
    
    // Auto-advance after short delay
    setTimeout(() => {
        currentSelectionIndex++;
        displaySelectionQuestion();
    }, 300);
}

function displayFreeResponseQuestion() {
    if (currentFreeResponseIndex >= freeResponseQuestions.length) {
        // Move to referral questions (moved from beginning)
        showScreen('referral');
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
    
    // Store answer using question text as key
    const currentQuestion = freeResponseQuestions[currentFreeResponseIndex];
    surveyData.freeResponseAnswers[currentQuestion] = answer;
    
    currentFreeResponseIndex++;
    displayFreeResponseQuestion();
}

function handleSelectionBack() {
    if (currentSelectionIndex > 0) {
        // Go back to previous selection question
        currentSelectionIndex--;
        displaySelectionQuestion();
    } else {
        // Go back to previous screen
        goBackToPreviousScreen();
    }
}

function handleFreeResponseBack() {
    if (currentFreeResponseIndex > 0) {
        // Go back to previous free response question
        currentFreeResponseIndex--;
        displayFreeResponseQuestion();
    } else {
        // Go back to selection questions
        currentStep = 'selection';
        currentSelectionIndex = randomizedSelectionQuestions.length - 1;
        showScreen('selection', false);
    }
}

function handleReferralContinue() {
    const referral = document.getElementById('referral-input').value.trim();
    
    if (!referral) {
        alert('please let us know who sent you this survey');
        return;
    }
    
    surveyData.referral = referral;
    showScreen('relationship');
}

function handleReferralBack() {
    // Go back to last selection question (since we're skipping free response)
    currentStep = 'selection';
    currentSelectionIndex = randomizedSelectionQuestions.length - 1;
    showScreen('selection', false);
}

function goBackToPreviousScreen() {
    if (navigationHistory.length > 0) {
        const previousState = navigationHistory.pop();
        currentStep = previousState.step;
        currentSelectionIndex = previousState.selectionIndex;
        currentFreeResponseIndex = previousState.freeResponseIndex;
        showScreen(previousState.step, false);
    }
}

async function submitSurveyData() {
    try {
        // Prepare data for submission
        const submissionData = {
            timestamp: new Date().toISOString(),
            surveyVersion: "2.0", // Version tracking for data analysis
            firstName: surveyData.firstName,
            lastName: surveyData.lastName,
            selectionAnswers: surveyData.selectionAnswers,
            freeResponseAnswers: surveyData.freeResponseAnswers,
            referral: surveyData.referral,
            relationshipType: surveyData.relationshipType,
            friendshipReasons: surveyData.friendshipReasons,
            closenessRating: surveyData.closenessRating
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

// Relationship characterization handlers
function handleRelationshipChoice(event) {
    const value = event.target.dataset.value;
    
    // Update UI
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Store answer
    surveyData.relationshipType = value;
    
    // Auto-advance after short delay
    setTimeout(() => {
        showScreen('ranking');
    }, 300);
}

function handleRelationshipBack() {
    showScreen('referral', false);
}

// Ranking system handlers and drag-and-drop
function setupDragAndDrop() {
    const container = document.getElementById('ranking-container');
    const items = container.querySelectorAll('.ranking-item');
    
    items.forEach((item, index) => {
        item.draggable = true;
        item.dataset.originalIndex = index;
        
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
    });
    
    updateRankingNumbers();
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnter(e) {
    e.preventDefault();
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.preventDefault();
    // Only remove drag-over if we're actually leaving this element
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    
    // Clear all drag-over states
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    if (this !== draggedElement) {
        const container = document.getElementById('ranking-container');
        const allItems = [...container.querySelectorAll('.ranking-item')];
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedElement, this);
        }
        
        updateRankingNumbers();
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    draggedElement = null;
}

function updateRankingNumbers() {
    const items = document.querySelectorAll('.ranking-item');
    items.forEach((item, index) => {
        // Remove existing number if present
        const existingNumber = item.querySelector('.ranking-number');
        if (existingNumber) {
            existingNumber.remove();
        }
        
        // Add new number
        const numberEl = document.createElement('div');
        numberEl.className = 'ranking-number';
        numberEl.textContent = index + 1;
        item.appendChild(numberEl);
    });
}

function handleRankingContinue() {
    // Get current order
    const items = document.querySelectorAll('.ranking-item');
    const ranking = Array.from(items).map(item => item.dataset.value);
    
    surveyData.friendshipReasons = ranking;
    showScreen('closeness');
}

function handleRankingBack() {
    showScreen('relationship', false);
}

// Closeness scale handlers
function handleClosenessChoice(event) {
    const value = parseInt(event.target.dataset.value);
    
    // Update UI
    document.querySelectorAll('.closeness-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Store answer
    surveyData.closenessRating = value;
    
    // Auto-advance after short delay
    setTimeout(() => {
        submitSurveyData();
    }, 300);
}

function handleClosenessBack() {
    showScreen('ranking', false);
}

function updateClosenessReferralName() {
    const referralNameEl = document.getElementById('referral-name');
    if (referralNameEl && surveyData.referral) {
        referralNameEl.textContent = surveyData.referral;
    }
}

function updateRelationshipReferralName() {
    const referralNameEl = document.getElementById('relationship-referral-name');
    if (referralNameEl && surveyData.referral) {
        referralNameEl.textContent = surveyData.referral;
    }
}

// Keyboard navigation for better UX
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (currentStep === 'name') {
            handleNameContinue();
        } else if (currentStep === 'referral') {
            handleReferralContinue();
        } else if (currentStep === 'freeresponse') {
            handleFreeResponseContinue();
        } else if (currentStep === 'ranking') {
            handleRankingContinue();
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
    
    // Number keys for closeness questions
    if (currentStep === 'closeness' && event.key >= '0' && event.key <= '9') {
        const btnValue = event.key;
        const btn = document.querySelector(`.closeness-btn[data-value="${btnValue}"]`);
        if (btn) {
            btn.click();
        }
    }
});