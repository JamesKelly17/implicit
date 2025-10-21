// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Stimulus {
  stimulus: string | HTMLImageElement;
  correct: number;
  index: number | string;
  brand?: string;
  start?: number;
  end?: number;
  reactionTime?: number;
}

interface ResponseData {
  round: number;
  correct: 'C' | 'X';
  reactionTime: number;
  brandIndex: number | string;
  brandName: string;
  brandSide: 'left' | 'right';
  wordIndex: number | string;
  wordText: string;
  counterbalanceCondition: number;
  appleMusicSide: 'left' | 'right';
  spotifySide: 'left' | 'right';
}

interface BrandImages {
  brand1: string;
  brand2: string;
}

// =====================================================
// CONFIGURATION & GLOBAL VARIABLES
// =====================================================

const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const brand1Name: string = 'Apple Music';
const brand2Name: string = 'Spotify';

let currentRound: number = 0;
let currentStimulus: Stimulus | null = null;
let currentBrand: Stimulus | null = null;
let stimuli: Stimulus[] = [];
let stimuli2: Stimulus[] = [];
let allResponses: ResponseData[] = [];
let fix: number = 0;

const brandSideAssignment: number = Math.random() < 0.5 ? 0 : 1;
const leftBrand: string = brandSideAssignment === 0 ? brand1Name : brand2Name;
const rightBrand: string = brandSideAssignment === 0 ? brand2Name : brand1Name;

// =====================================================
// STIMULI DEFINITIONS
// =====================================================

const wordStimuli: string[] = [
  'Love', 'For Me', 'Personal', 'Inspired', 'Fun', 'Excitement',
  'Playful', 'Authentic', 'Comfort', 'Culture', 'Bold', 'Compassionate'
];

const brandImages: BrandImages = {
  brand1: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg',
  brand2: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'
};

// =====================================================
// NAVIGATION FUNCTIONS
// =====================================================

function showRoundInstructions(): void {
  const initialInstructions = document.getElementById('initialInstructions');
  const roundInstructions = document.getElementById('roundInstructions');
  
  if (initialInstructions) initialInstructions.classList.add('hidden');
  if (roundInstructions) roundInstructions.classList.remove('hidden');
}

function startTask(): void {
  const roundInstructions = document.getElementById('roundInstructions');
  const taskContainer = document.getElementById('taskContainer');
  const labelLeft = document.querySelector('.label-left');
  const labelRight = document.querySelector('.label-right');
  
  if (roundInstructions) roundInstructions.classList.add('hidden');
  if (taskContainer) taskContainer.style.display = 'block';
  
  if (labelLeft) labelLeft.textContent = leftBrand;
  if (labelRight) labelRight.textContent = rightBrand;
  
  if (isMobile) {
    const keyInstructions = document.getElementById('keyInstructions');
    const buttonInstructions = document.getElementById('buttonInstructions');
    const labelLeft2 = document.querySelector('.label-left2');
    const labelRight2 = document.querySelector('.label-right2');
    const mobileButtons = document.getElementById('mobileButtons');
    
    if (taskContainer) taskContainer.classList.add('mobile');
    if (keyInstructions) keyInstructions.classList.add('hidden');
    if (buttonInstructions) buttonInstructions.classList.remove('hidden');
    if (labelLeft2) labelLeft2.textContent = '(press "left")';
    if (labelRight2) labelRight2.textContent = '(press "right")';
    if (mobileButtons) mobileButtons.classList.add('show');
  }
  
  loadRound(1);
}

// =====================================================
// ROUND MANAGEMENT
// =====================================================

function loadRound(roundNum: number): void {
  currentRound = roundNum;
  
  const loadingMessage = document.getElementById('loadingMessage');
  const messageCenter = document.getElementById('messageCenter');
  const instructions = document.getElementById('taskInstructions');
  
  if (loadingMessage) loadingMessage.style.display = 'none';
  if (messageCenter) messageCenter.style.display = 'none';
  
  const titles: string[] = ['Practice Round', 'Round 1', 'Final Round'];
  const parts: string[] = ['Part 1 of 3', 'Part 2 of 3', 'Part 3 of 3'];
  
  const startInstruction: string = isMobile
    ? "When you are ready, please <span style='font-weight: bold; color: #27ae60'>press either the Left or Right button to begin.</span>"
    : "When you are ready, please <span style='font-weight: bold; color: #27ae60'>press the [Space bar] to begin.</span>";
  
  if (instructions) {
    instructions.innerHTML = `
      <p><span style="font-weight: bold; font-size:26px;color: blue">${titles[roundNum - 1]}</span><br><br>
      ${roundNum === 1 ? "<span style='font-weight: bold'>Let's go through this one more time.</span>" : "<span style='font-weight: bold'>Same rules as before.</span>"}
      Place your ${isMobile ? 'fingers on the left and right buttons' : 'left and right index fingers on the E and I keys'}. 
      At the top of the screen are 2 brands. In the task, brand logos will appear in the middle of the screen.<br><br>
      When the logo matches the brand on the left, press the ${isMobile ? '<strong>left</strong> button' : '<strong>E</strong> key'} as fast as you can. 
      When it matches the brand on the right, press the ${isMobile ? '<strong>right</strong> button' : '<strong>I</strong> key'} as fast as you can. 
      If you make an error, a red <span style="font-weight: bold; color: red">X</span> will appear. 
      Correct errors by hitting the other ${isMobile ? 'button' : 'key'}. 
      Please try to go as <em>fast as you can</em> while making as few errors as possible. 
      If you are going too slow, a <span style="color: red">"Too Slow"</span> message will appear.<br><br>
      ${startInstruction}<br><br>
      ${parts[roundNum - 1]}</p>
    `;
    instructions.style.display = 'block';
  }
  
  buildStimuli(roundNum);
  
  if (!isMobile) {
    document.addEventListener('keyup', handleKeyPress);
  } else {
    const buttonLeft = document.getElementById('buttonLeft');
    const buttonRight = document.getElementById('buttonRight');
    
    if (buttonLeft) buttonLeft.onclick = () => simulateKey(69);
    if (buttonRight) buttonRight.onclick = () => simulateKey(73);
  }
}

function buildStimuli(roundNum: number): void {
  stimuli = [];
  stimuli2 = [];
  
  const numTrials: number = roundNum === 1 ? 6 : (roundNum === 2 ? 12 : 48);
  
  for (let i = 0; i < numTrials; i++) {
    stimuli.push({ stimulus: '', correct: 0, index: '' });
    stimuli2.push({ stimulus: '', correct: 0, index: '' });
  }
  
  const half: number = stimuli2.length / 2;
  
  const brand1KeyCode: number = leftBrand === brand1Name ? 69 : 73;
  const brand2KeyCode: number = leftBrand === brand2Name ? 69 : 73;
  
  for (let i = 0; i < half; i++) {
    const img = new Image();
    img.src = brandImages.brand1;
    img.className = 'stimulus-image';
    stimuli2[i] = {
      stimulus: img,
      correct: brand1KeyCode,
      index: 15 + i,
      brand: brand1Name
    };
  }
  
  for (let i = half; i < stimuli2.length; i++) {
    const img = new Image();
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
    const wordsPerStimulus: number = Math.floor(numTrials / wordStimuli.length);
    const wordPool: Stimulus[] = [];
    
    for (let wordIdx = 0; wordIdx < wordStimuli.length; wordIdx++) {
      for (let repeat = 0; repeat < wordsPerStimulus; repeat++) {
        wordPool.push({
          stimulus: `<div class="stimulus-word">${wordStimuli[wordIdx]}</div>`,
          correct: 0,
          index: wordIdx + 1
        });
      }
    }
    
    shuffle(wordPool);
    
    for (let i = 0; i < stimuli.length; i++) {
      stimuli[i] = wordPool[i];
    }
  }
  
  shuffle(stimuli2);
}

function shuffle<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// =====================================================
// INPUT HANDLING
// =====================================================

function handleKeyPress(e: KeyboardEvent): void {
  const keyCode: number = e.keyCode;
  
  if (!currentStimulus && keyCode === 32) {
    startRound();
    return;
  }
  
  if (!(keyCode === 69 || keyCode === 73)) return;
  
  processResponse(keyCode);
}

function simulateKey(keyCode: number): void {
  if (!currentStimulus) {
    startRound();
    return;
  }
  processResponse(keyCode);
}

// =====================================================
// TRIAL MANAGEMENT
// =====================================================

function startRound(): void {
  const taskInstructions = document.getElementById('taskInstructions');
  const messageCenter = document.getElementById('messageCenter');
  
  if (taskInstructions) taskInstructions.style.display = 'none';
  
  if (messageCenter) {
    messageCenter.style.display = 'flex';
    messageCenter.innerHTML = '+';
  }
  
  setTimeout(nextQuestion, 500);
}

function nextQuestion(): void {
  if (stimuli2.length === 0) {
    endRound();
    return;
  }
  
  currentStimulus = stimuli.pop() || null;
  currentBrand = stimuli2.pop() || null;
  
  const messageCenter = document.getElementById('messageCenter');
  const errorMessage = document.getElementById('errorMessage');
  
  if (messageCenter) messageCenter.innerHTML = '';
  if (errorMessage) errorMessage.textContent = '';
  
  if (currentBrand) {
    currentBrand.start = Date.now();
    
    if (messageCenter) {
      if (currentRound === 3 && currentStimulus && currentStimulus.stimulus) {
        messageCenter.innerHTML = currentStimulus.stimulus as string;
        
        setTimeout(() => {
          messageCenter.innerHTML = '';
        }, 200);
        
        setTimeout(() => {
          messageCenter.innerHTML = '';
          if (currentBrand && currentBrand.stimulus instanceof HTMLImageElement) {
            messageCenter.appendChild(currentBrand.stimulus);
          }
        }, 300);
      } else {
        if (currentBrand.stimulus instanceof HTMLImageElement) {
          messageCenter.appendChild(currentBrand.stimulus);
        }
      }
    }
  }
}

function processResponse(keyCode: number): void {
  if (!currentBrand) return;
  
  if (keyCode === currentBrand.correct) {
    currentBrand.end = Date.now();
    currentBrand.reactionTime = currentBrand.end - (currentBrand.start || 0);
    
    const brandName: string = currentBrand.brand || '';
    const brandSide: 'left' | 'right' = keyCode === 69 ? 'left' : 'right';
    
    let wordText: string = '';
    let wordIndex: number | string = '';
    
    if (currentRound === 3 && currentStimulus && currentStimulus.stimulus) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentStimulus.stimulus as string;
      wordText = tempDiv.textContent || tempDiv.innerText || '';
      wordIndex = currentStimulus.index;
    }
    
    const responseData: ResponseData = {
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
    
    const messageCenter = document.getElementById('messageCenter');
    const errorMessage = document.getElementById('errorMessage');
    
    if (currentBrand.reactionTime < 1250) {
      if (messageCenter) messageCenter.innerHTML = '+';
      fix = 0;
      currentStimulus = null;
      if (errorMessage) errorMessage.textContent = '';
      setTimeout(nextQuestion, 400);
    } else {
      if (messageCenter) messageCenter.innerHTML = '<div style="color:red;font-size:30px">Too Slow</div>';
      fix = 0;
      currentStimulus = null;
      if (errorMessage) errorMessage.textContent = '';
      setTimeout(nextQuestion, 400);
    }
  } else {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) errorMessage.textContent = 'X';
    fix = 1;
  }
}

function endRound(): void {
  if (currentRound < 3) {
    const messageCenter = document.getElementById('messageCenter');
    if (messageCenter) messageCenter.innerHTML = '+';
    setTimeout(() => {
      loadRound(currentRound + 1);
    }, 1000);
  } else {
    completeTask();
  }
}

// =====================================================
// COMPLETION & DATA EXPORT
// =====================================================

function completeTask(): void {
  const taskContainer = document.getElementById('taskContainer');
  const completion = document.getElementById('completion');
  
  if (taskContainer) taskContainer.style.display = 'none';
  if (completion) completion.style.display = 'block';
  
  localStorage.setItem('iat_responses', JSON.stringify(allResponses));
}

function downloadData(format: 'json' | 'csv' = 'json'): void {
  const timestamp: string = new Date().toISOString().replace(/[:.]/g, '-');
  let dataStr: string;
  let dataBlob: Blob;
  let filename: string;
  
  if (format === 'csv') {
    dataStr = convertToCSV(allResponses);
    dataBlob = new Blob([dataStr], { type: 'text/csv' });
    filename = `survey_results_${timestamp}.csv`;
  } else {
    dataStr = JSON.stringify(allResponses, null, 2);
    dataBlob = new Blob([dataStr], { type: 'application/json' });
    filename = `survey_results_${timestamp}.json`;
  }
  
  const url: string = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function convertToCSV(data: ResponseData[]): string {
  if (data.length === 0) return '';
  
  const headers: string[] = Object.keys(data[0]);
  let csv: string = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header as keyof ResponseData];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
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

(window as any).showRoundInstructions = showRoundInstructions;
(window as any).startTask = startTask;
(window as any).downloadData = downloadData;