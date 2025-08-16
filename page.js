
const clockInSection = document.getElementById('clock-in-section');
const clockInBtn = document.getElementById('clock-in-btn');
const statusMessage = document.getElementById('status-message');
const drinkTypeSection = document.getElementById('drink-type-section');
const selectWaterBtn = document.getElementById('select-water-btn');
const selectOtherBtn = document.getElementById('select-other-btn');
const intakeSection = document.getElementById('intake-section');
const intakeTitle = document.getElementById('intake-title');
const progressSection = document.getElementById('progress-section');
const progressDisplay = document.getElementById('progress-display');
const progressBarFill = document.getElementById('progress-bar-fill');
const animationDisplay = document.getElementById('animation-display');
const drinkButtons = document.querySelectorAll('.drink-btn');
const undoBtn = document.getElementById('undo-btn');
const customAmountInput = document.getElementById('custom-amount');
const addCustomBtn = document.getElementById('add-custom-btn');
const drinkSuggestionBtn = document.getElementById('drink-suggestion-btn');

const dailyGoal = 2000;
const storageKey = 'drinkTrackerState';
const getTodayDate = () => new Date().toDateString();

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 18) return "Good afternoon! 🤍";
    return "Good evening! 🌙";
};

const getState = () => {
    try {
        const storedState = localStorage.getItem(storageKey);
        return storedState ? JSON.parse(storedState) : null;
    } catch (e) {
        console.error("Error retrieving from localStorage", e);
        return null;
    }
};

const saveState = (state) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
};

const updateUI = (state) => {
    const today = getTodayDate();
    const isNewDay = state && state.date !== today;

    if (isNewDay) {
        const yesterdayWater = state.totalWater;
        statusMessage.textContent = `${getGreeting()} Yesterday you drank ${yesterdayWater}ml.`;
        animationDisplay.textContent = yesterdayWater >= dailyGoal ? '👍' : '😔';
        clockInSection.classList.remove('hidden');
        drinkTypeSection.classList.add('hidden');
        intakeSection.classList.add('hidden');
        progressSection.classList.add('hidden');
        undoBtn.classList.add('hidden');
        localStorage.removeItem(storageKey);
        return;
    }

    if (state) {
        statusMessage.textContent = `${getGreeting()} What did you drink?`;
        clockInSection.classList.add('hidden');
        drinkTypeSection.classList.remove('hidden');
        intakeSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        animationDisplay.textContent = '';
        progressDisplay.textContent = state.totalWater;
        const progressPercentage = (state.totalWater / dailyGoal) * 100;
        progressBarFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        
        undoBtn.classList.toggle('hidden', state.intakeHistory.length === 0);
        
    } else {
        statusMessage.textContent = `${getGreeting()}water tracking activated…get that glow up ✨`;
        clockInSection.classList.remove('hidden');
        drinkTypeSection.classList.add('hidden');
        intakeSection.classList.add('hidden');
        progressSection.classList.add('hidden');
        undoBtn.classList.add('hidden');
        animationDisplay.textContent = '';
    }
};

const handleClockIn = () => {
    const initialState = {
        date: getTodayDate(),
        totalWater: 0,
        intakeHistory: []
    };
    saveState(initialState);
    updateUI(initialState);
};

const handleDrinkIntake = (amount) => {
    const state = getState();
    if (state && amount > 0) {
        state.totalWater += amount;
        state.intakeHistory.push(amount);
        saveState(state);
        updateUI(state);
    }
};

const handleUndo = () => {
    const state = getState();
    if (state && state.intakeHistory.length > 0) {
        const lastAmount = state.intakeHistory.pop();
        state.totalWater = Math.max(0, state.totalWater - lastAmount);
        saveState(state);
        updateUI(state);
    }
};

const handleCustomAmount = () => {
    const amount = parseInt(customAmountInput.value, 10);
    if (amount > 0) {
        handleDrinkIntake(amount);
        customAmountInput.value = '';
    }
};

const showIntakeOptions = (drinkType) => {
    drinkTypeSection.classList.add('hidden');
    intakeSection.classList.remove('hidden');
    intakeTitle.textContent = `How much ${drinkType} did you drink?`;
};

document.addEventListener('DOMContentLoaded', () => {
    const initialState = getState();
    updateUI(initialState);
});

clockInBtn.addEventListener('click', handleClockIn);
selectWaterBtn.addEventListener('click', () => showIntakeOptions("water"));
selectOtherBtn.addEventListener('click', () => showIntakeOptions("other drink"));
drinkButtons.forEach(button => {
    button.addEventListener('click', (event) => handleDrinkIntake(parseInt(event.currentTarget.dataset.amount, 10)));
});
undoBtn.addEventListener('click', handleUndo);
addCustomBtn.addEventListener('click', handleCustomAmount);