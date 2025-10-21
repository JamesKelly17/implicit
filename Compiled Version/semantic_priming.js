// =====================================================
// TYPE DEFINITIONS
// =====================================================
// =====================================================
// CONFIGURATION & GLOBAL VARIABLES
// =====================================================
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var brand1Name = 'Apple Music';
var brand2Name = 'Spotify';
var currentRound = 0;
var currentStimulus = null;
var currentBrand = null;
var stimuli = [];
var stimuli2 = [];
var allResponses = [];
var fix = 0;
var brandSideAssignment = Math.random() < 0.5 ? 0 : 1;
var leftBrand = brandSideAssignment === 0 ? brand1Name : brand2Name;
var rightBrand = brandSideAssignment === 0 ? brand2Name : brand1Name;
// =====================================================
// STIMULI DEFINITIONS
// =====================================================
var wordStimuli = [
    'Love', 'For Me', 'Personal', 'Inspired', 'Fun', 'Excitement',
    'Playful', 'Authentic', 'Comfort', 'Culture', 'Bold', 'Compassionate'
];
var brandImages = {
    brand1: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg',
    brand2: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'
};
// =====================================================
// NAVIGATION FUNCTIONS
// =====================================================
function showRoundInstructions() {
    var initialInstructions = document.getElementById('initialInstructions');
    var roundInstructions = document.getElementById('roundInstructions');
    if (initialInstructions)
        initialInstructions.classList.add('hidden');
    if (roundInstructions)
        roundInstructions.classList.remove('hidden');
}
function startTask() {
    var roundInstructions = document.getElementById('roundInstructions');
    var taskContainer = document.getElementById('taskContainer');
    var labelLeft = document.querySelector('.label-left');
    var labelRight = document.querySelector('.label-right');
    if (roundInstructions)
        roundInstructions.classList.add('hidden');
    if (taskContainer)
        taskContainer.style.display = 'block';
    if (labelLeft)
        labelLeft.textContent = leftBrand;
    if (labelRight)
        labelRight.textContent = rightBrand;
    if (isMobile) {
        var keyInstructions = document.getElementById('keyInstructions');
        var buttonInstructions = document.getElementById('buttonInstructions');
        var labelLeft2 = document.querySelector('.label-left2');
        var labelRight2 = document.querySelector('.label-right2');
        var mobileButtons = document.getElementById('mobileButtons');
        if (taskContainer)
            taskContainer.classList.add('mobile');
        if (keyInstructions)
            keyInstructions.classList.add('hidden');
        if (buttonInstructions)
            buttonInstructions.classList.remove('hidden');
        if (labelLeft2)
            labelLeft2.textContent = '(press "left")';
        if (labelRight2)
            labelRight2.textContent = '(press "right")';
        if (mobileButtons)
            mobileButtons.classList.add('show');
    }
    loadRound(1);
}
// =====================================================
// ROUND MANAGEMENT
// =====================================================
function loadRound(roundNum) {
    currentRound = roundNum;
    var loadingMessage = document.getElementById('loadingMessage');
    var messageCenter = document.getElementById('messageCenter');
    var instructions = document.getElementById('taskInstructions');
    if (loadingMessage)
        loadingMessage.style.display = 'none';
    if (messageCenter)
        messageCenter.style.display = 'none';
    var titles = ['Practice Round', 'Round 1', 'Final Round'];
    var parts = ['Part 1 of 3', 'Part 2 of 3', 'Part 3 of 3'];
    var startInstruction = isMobile
        ? "When you are ready, please <span style='font-weight: bold; color: #27ae60'>press either the Left or Right button to begin.</span>"
        : "When you are ready, please <span style='font-weight: bold; color: #27ae60'>press the [Space bar] to begin.</span>";
    if (instructions) {
        instructions.innerHTML = "\n      <p><span style=\"font-weight: bold; font-size:26px;color: blue\">".concat(titles[roundNum - 1], "</span><br><br>\n      ").concat(roundNum === 1 ? "<span style='font-weight: bold'>Let's go through this one more time.</span>" : "<span style='font-weight: bold'>Same rules as before.</span>", "\n      Place your ").concat(isMobile ? 'fingers on the left and right buttons' : 'left and right index fingers on the E and I keys', ". \n      At the top of the screen are 2 brands. In the task, brand logos will appear in the middle of the screen.<br><br>\n      When the logo matches the brand on the left, press the ").concat(isMobile ? '<strong>left</strong> button' : '<strong>E</strong> key', " as fast as you can. \n      When it matches the brand on the right, press the ").concat(isMobile ? '<strong>right</strong> button' : '<strong>I</strong> key', " as fast as you can. \n      If you make an error, a red <span style=\"font-weight: bold; color: red\">X</span> will appear. \n      Correct errors by hitting the other ").concat(isMobile ? 'button' : 'key', ". \n      Please try to go as <em>fast as you can</em> while making as few errors as possible. \n      If you are going too slow, a <span style=\"color: red\">\"Too Slow\"</span> message will appear.<br><br>\n      ").concat(startInstruction, "<br><br>\n      ").concat(parts[roundNum - 1], "</p>\n    ");
        instructions.style.display = 'block';
    }
    buildStimuli(roundNum);
    if (!isMobile) {
        document.addEventListener('keyup', handleKeyPress);
    }
    else {
        var buttonLeft = document.getElementById('buttonLeft');
        var buttonRight = document.getElementById('buttonRight');
        if (buttonLeft)
            buttonLeft.onclick = function () { return simulateKey(69); };
        if (buttonRight)
            buttonRight.onclick = function () { return simulateKey(73); };
    }
}
function buildStimuli(roundNum) {
    stimuli = [];
    stimuli2 = [];
    var numTrials = roundNum === 1 ? 6 : (roundNum === 2 ? 12 : 48);
    for (var i = 0; i < numTrials; i++) {
        stimuli.push({ stimulus: '', correct: 0, index: '' });
        stimuli2.push({ stimulus: '', correct: 0, index: '' });
    }
    var half = stimuli2.length / 2;
    var brand1KeyCode = leftBrand === brand1Name ? 69 : 73;
    var brand2KeyCode = leftBrand === brand2Name ? 69 : 73;
    for (var i = 0; i < half; i++) {
        var img = new Image();
        img.src = brandImages.brand1;
        img.className = 'stimulus-image';
        stimuli2[i] = {
            stimulus: img,
            correct: brand1KeyCode,
            index: 15 + i,
            brand: brand1Name
        };
    }
    for (var i = half; i < stimuli2.length; i++) {
        var img = new Image();
        img.src = brandImages.brand2;
        img.className = 'stimulus-image';
        stimuli2[i] = {
            stimulus: img,
            correct: brand2KeyCode,
            index: 20 + (i - half),
            brand: brand2Name
        };
    }
    if (roundNum === 3) {
        var wordsPerStimulus = Math.floor(numTrials / wordStimuli.length);
        var wordPool = [];
        for (var wordIdx = 0; wordIdx < wordStimuli.length; wordIdx++) {
            for (var repeat = 0; repeat < wordsPerStimulus; repeat++) {
                wordPool.push({
                    stimulus: "<div class=\"stimulus-word\">".concat(wordStimuli[wordIdx], "</div>"),
                    correct: 0,
                    index: wordIdx + 1
                });
            }
        }
        shuffle(wordPool);
        for (var i = 0; i < stimuli.length; i++) {
            stimuli[i] = wordPool[i];
        }
    }
    shuffle(stimuli2);
}
function shuffle(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
}
// =====================================================
// INPUT HANDLING
// =====================================================
function handleKeyPress(e) {
    var keyCode = e.keyCode;
    if (!currentStimulus && keyCode === 32) {
        startRound();
        return;
    }
    if (!(keyCode === 69 || keyCode === 73))
        return;
    processResponse(keyCode);
}
function simulateKey(keyCode) {
    if (!currentStimulus) {
        startRound();
        return;
    }
    processResponse(keyCode);
}
// =====================================================
// TRIAL MANAGEMENT
// =====================================================
function startRound() {
    var taskInstructions = document.getElementById('taskInstructions');
    var messageCenter = document.getElementById('messageCenter');
    if (taskInstructions)
        taskInstructions.style.display = 'none';
    if (messageCenter) {
        messageCenter.style.display = 'flex';
        messageCenter.innerHTML = '+';
    }
    setTimeout(nextQuestion, 500);
}
function nextQuestion() {
    if (stimuli2.length === 0) {
        endRound();
        return;
    }
    currentStimulus = stimuli.pop() || null;
    currentBrand = stimuli2.pop() || null;
    var messageCenter = document.getElementById('messageCenter');
    var errorMessage = document.getElementById('errorMessage');
    if (messageCenter)
        messageCenter.innerHTML = '';
    if (errorMessage)
        errorMessage.textContent = '';
    if (currentBrand) {
        currentBrand.start = Date.now();
        if (messageCenter) {
            if (currentRound === 3 && currentStimulus && currentStimulus.stimulus) {
                messageCenter.innerHTML = currentStimulus.stimulus;
                setTimeout(function () {
                    messageCenter.innerHTML = '';
                }, 200);
                setTimeout(function () {
                    messageCenter.innerHTML = '';
                    if (currentBrand && currentBrand.stimulus instanceof HTMLImageElement) {
                        messageCenter.appendChild(currentBrand.stimulus);
                    }
                }, 300);
            }
            else {
                if (currentBrand.stimulus instanceof HTMLImageElement) {
                    messageCenter.appendChild(currentBrand.stimulus);
                }
            }
        }
    }
}
function processResponse(keyCode) {
    if (!currentBrand)
        return;
    if (keyCode === currentBrand.correct) {
        currentBrand.end = Date.now();
        currentBrand.reactionTime = currentBrand.end - (currentBrand.start || 0);
        var brandName = currentBrand.brand || '';
        var brandSide = keyCode === 69 ? 'left' : 'right';
        var wordText = '';
        var wordIndex = '';
        if (currentRound === 3 && currentStimulus && currentStimulus.stimulus) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = currentStimulus.stimulus;
            wordText = tempDiv.textContent || tempDiv.innerText || '';
            wordIndex = currentStimulus.index;
        }
        var responseData = {
            round: currentRound,
            correct: fix === 0 ? 'C' : 'X',
            reactionTime: currentBrand.reactionTime,
            brandIndex: currentBrand.index,
            brandName: brandName,
            brandSide: brandSide,
            wordIndex: wordIndex,
            wordText: wordText,
            counterbalanceCondition: brandSideAssignment,
            appleMusicSide: leftBrand === 'Apple Music' ? 'left' : 'right',
            spotifySide: leftBrand === 'Spotify' ? 'left' : 'right'
        };
        allResponses.push(responseData);
        var messageCenter = document.getElementById('messageCenter');
        var errorMessage = document.getElementById('errorMessage');
        if (currentBrand.reactionTime < 1250) {
            if (messageCenter)
                messageCenter.innerHTML = '+';
            fix = 0;
            currentStimulus = null;
            if (errorMessage)
                errorMessage.textContent = '';
            setTimeout(nextQuestion, 400);
        }
        else {
            if (messageCenter)
                messageCenter.innerHTML = '<div style="color:red;font-size:30px">Too Slow</div>';
            fix = 0;
            currentStimulus = null;
            if (errorMessage)
                errorMessage.textContent = '';
            setTimeout(nextQuestion, 400);
        }
    }
    else {
        var errorMessage = document.getElementById('errorMessage');
        if (errorMessage)
            errorMessage.textContent = 'X';
        fix = 1;
    }
}
function endRound() {
    if (currentRound < 3) {
        var messageCenter = document.getElementById('messageCenter');
        if (messageCenter)
            messageCenter.innerHTML = '+';
        setTimeout(function () {
            loadRound(currentRound + 1);
        }, 1000);
    }
    else {
        completeTask();
    }
}
// =====================================================
// COMPLETION & DATA EXPORT
// =====================================================
function completeTask() {
    var taskContainer = document.getElementById('taskContainer');
    var completion = document.getElementById('completion');
    if (taskContainer)
        taskContainer.style.display = 'none';
    if (completion)
        completion.style.display = 'block';
    localStorage.setItem('iat_responses', JSON.stringify(allResponses));
}
function downloadData(format) {
    if (format === void 0) { format = 'json'; }
    var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    var dataStr;
    var dataBlob;
    var filename;
    if (format === 'csv') {
        dataStr = convertToCSV(allResponses);
        dataBlob = new Blob([dataStr], { type: 'text/csv' });
        filename = "survey_results_".concat(timestamp, ".csv");
    }
    else {
        dataStr = JSON.stringify(allResponses, null, 2);
        dataBlob = new Blob([dataStr], { type: 'application/json' });
        filename = "survey_results_".concat(timestamp, ".json");
    }
    var url = URL.createObjectURL(dataBlob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
function convertToCSV(data) {
    if (data.length === 0)
        return '';
    var headers = Object.keys(data[0]);
    var csv = headers.join(',') + '\n';
    data.forEach(function (row) {
        var values = headers.map(function (header) {
            var value = row[header];
            if (typeof value === 'string' && value.includes(',')) {
                return "\"".concat(value, "\"");
            }
            return value;
        });
        csv += values.join(',') + '\n';
    });
    return csv;
}
// =====================================================
// MAKE FUNCTIONS AVAILABLE GLOBALLY FOR HTML ONCLICK
// =====================================================
window.showRoundInstructions = showRoundInstructions;
window.startTask = startTask;
window.downloadData = downloadData;
