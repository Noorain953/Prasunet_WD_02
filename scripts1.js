let startTime = 0, updatedTime = 0, difference = 0;
let interval;
let running = false;
let savedTime = 0;
let voiceRecognitionActive = false;
let recognition;

// DOM elements
const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const lapList = document.getElementById('lap-list');
const backgroundColorInput = document.getElementById('background-color');
const textColorInput = document.getElementById('text-color');
const buttonColorInput = document.getElementById('button-color');
const toggleVoiceBtn = document.getElementById('toggle-voice-btn');
const voiceStatus = document.getElementById('voice-status');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');

// Start the stopwatch
function startStopwatch() {
    if (!running) {
        startTime = Date.now() - savedTime;
        interval = setInterval(updateDisplay, 10);
        running = true;
    }
}

// Pause the stopwatch
function pauseStopwatch() {
    if (running) {
        clearInterval(interval);
        savedTime = Date.now() - startTime;
        running = false;
    }
}

// Reset the stopwatch
function resetStopwatch() {
    clearInterval(interval);
    display.textContent = "00:00:00";
    running = false;
    savedTime = 0;
    lapList.innerHTML = '';
}

// Record a lap time
function recordLap() {
    if (running) {
        const currentTime = display.textContent;
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${lapList.childElementCount + 1}: ${currentTime}`;
        lapList.appendChild(lapItem);
    }
}

// Update the stopwatch display
function updateDisplay() {
    updatedTime = Date.now();
    difference = updatedTime - startTime;

    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    const milliseconds = Math.floor((difference % 1000) / 10);

    display.textContent = `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

// Helper function to pad numbers
function pad(number) {
    return number < 10 ? `0${number}` : number;
}

// Update colors based on user input
function updateColors() {
    const backgroundColor = backgroundColorInput.value;
    const textColor = textColorInput.value;
    const buttonColor = buttonColorInput.value;

    document.querySelector('.container').style.backgroundColor = backgroundColor;
    display.style.color = textColor;
    document.querySelectorAll('button').forEach(btn => {
        btn.style.backgroundColor = buttonColor;
        btn.style.color = '#fff';
    });
}

// Initialize voice recognition
function initializeVoiceControl() {
    if (!('webkitSpeechRecognition' in window)) {
        voiceStatus.textContent = 'Speech recognition not supported.';
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        processVoiceCommand(command);
    };

    recognition.onerror = (event) => {
        voiceStatus.textContent = `Voice recognition error: ${event.error}`;
    };

    recognition.onend = () => {
        if (voiceRecognitionActive) {
            recognition.start(); // Restart recognition if it's still active
        } else {
            voiceStatus.textContent = 'Voice control is off';
        }
    };
}

// Process voice commands
function processVoiceCommand(command) {
    switch (command) {
        case 'start':
            startStopwatch();
            voiceStatus.textContent = `Command "${command}"`;
            break;
        case 'pause':
            pauseStopwatch();
            voiceStatus.textContent = `Command "${command}"`;
            break;
        case 'reset':
            resetStopwatch();
            voiceStatus.textContent = `Command "${command}"`;
            break;
        case 'lap':
            recordLap();
            voiceStatus.textContent = `Command "${command}"`;
            break;
        default:
            voiceStatus.textContent = `Command "${command}" not recognized.`;
    }
}

// Toggle voice control
function toggleVoiceControl() {
    if (voiceRecognitionActive) {
        recognition.stop();
        voiceRecognitionActive = false;
        voiceStatus.textContent = 'Voice control is off';
        toggleVoiceBtn.textContent = 'Start Voice Control';
        toggleVoiceBtn.classList.remove('active');
    } else {
        recognition.start();
        voiceRecognitionActive = true;
        voiceStatus.textContent = 'Voice control is active. Say "start", "pause", "reset", or "lap".';
        toggleVoiceBtn.textContent = 'Off Voice Control';
        toggleVoiceBtn.classList.add('active');
    }
}

// Toggle theme between light and dark mode
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('dark-mode');
    });
    toggleThemeBtn.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// Event listeners
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
backgroundColorInput.addEventListener('input', updateColors);
textColorInput.addEventListener('input', updateColors);
buttonColorInput.addEventListener('input', updateColors);
toggleVoiceBtn.addEventListener('click', toggleVoiceControl);
toggleThemeBtn.addEventListener('click', toggleTheme);

// Initialize voice control on load
initializeVoiceControl();
