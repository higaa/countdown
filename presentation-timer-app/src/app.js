const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const timeInput = document.getElementById('timeInput');
let timerInterval;
let totalTime = 0;

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    const duration = parseInt(timeInput.value) * 60;
    totalTime = duration;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (totalTime <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "時間切れ";
        timerInterval = null;
        return;
    }
    
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    if (totalTime >= 60) {
        timerDisplay.textContent = `残り時間: ${minutes}分`;
    } else {
        timerDisplay.textContent = `残り時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    totalTime--;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);