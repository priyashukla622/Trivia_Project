let questions = [];
let currentIndex = 0;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 0;
let players =[];
function startGame() {
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;

    if (player1 === "" || player2 === "") {
        alert("Please enter both player names");
    } else {
        players = [player1, player2];
        document.querySelector('.player-form').style.display = 'none';
        document.querySelector('.category-form').style.display = 'block';
        showCategories();
    }
}
function showCategories() {
    fetch('https://the-trivia-api.com/v2/categories')
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = '<option>Choose Category</option>';
            for (let category in data) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });
}
function hideCategory() {
    const selectedCategory = document.getElementById('category').value;
    if (selectedCategory) {
        document.querySelector('.category-form').style.display = 'none';
        document.querySelector('.question-form').style.display = 'block';
        findQuestions(selectedCategory);
    } else {
        alert("Please select a category");
    }
}
let easyQ = [];
let mediumQ = [];
let hardQ = [];
async function findQuestions(category) {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=10&difficulties=easy,medium,hard`);
        const fetchQ = await response.json();
        console.log(fetchQ);
        easyQ = fetchQ.filter(q => q.difficulty === 'easy').slice(0, 2);
        mediumQ = fetchQ.filter(q => q.difficulty === 'medium').slice(0, 2);
        hardQ= fetchQ.filter(q => q.difficulty === 'hard').slice(0, 2);
        questions = [...easyQ, ...mediumQ, ...hardQ];
        console.log(questions);
        getQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}
function getQuestion() {
    document.getElementById('next-question').style.display = 'none';
    if (currentIndex < questions.length) {
        const currentQuestion = questions[currentIndex]; 
        const currentPlayerName = players[currentPlayer];
        document.getElementById('question-text').innerHTML = `
            <h4>This question is for ${currentPlayerName}</h4>
            <h5>${currentQuestion.question.text}</h5>
            <h6 style="color:brown">(Difficulty: ${currentQuestion.difficulty})</h6>
        `;
        const answersDiv = document.getElementById('answers');
        answersDiv.innerHTML = '';

        const allAnswers = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
        allAnswers.sort(() => Math.random() - 0.5); 

        allAnswers.forEach(answer => { 
            const button = document.createElement('button');
            button.className = 'answer-button'; 
            button.textContent = answer; 
            answersDiv.appendChild(button); 
            button.onclick = () => matchAnswer(answer);
        });
    } else {
        showSubmitBtn();
    }
}

function matchAnswer(selectedAnswer) {
    const correctAnswer = questions[currentIndex].correctAnswer;
    let points = 0;
    let scoreMessage = '';
    const questionText = document.getElementById('question-text');
    if (selectedAnswer === correctAnswer) {
        if (currentIndex < 2) {
            points = 10; 
        } else if (currentIndex < 4) {
            points = 15; 
        } else if (currentIndex < 6) {
            points = 20; 
        }
        if (currentPlayer === 0) {
            player1Score += points;
            scoreMessage = `<p style="color: green;">Correct! You got ${points} points. Total: ${player1Score} points.</p>`;
        } else {
            player2Score += points;
            scoreMessage = `<p style="color: green;">Correct! You got ${points} points. Total: ${player2Score} points.</p>`;
        }

    } else {
        scoreMessage = `<p style="color: red;font-size: 16px;">Incorrect! The correct answer is: ${correctAnswer}. Total: ${currentPlayer === 0 ?
         player1Score : player2Score} points.</p>`;
    }
    questionText.innerHTML += scoreMessage;

    const nextButton = document.getElementById('next-question');
    nextButton.style.display = 'block';
}

function NextQuestionFn() {
    const nextButton = document.getElementById('next-question');
    nextButton.style.display = 'none';

    if (currentPlayer === 0) {
        currentPlayer = 1;
    } else {
        currentPlayer = 0;
    }
    currentIndex++;
    

    if (currentIndex < questions.length) {
        getQuestion(); 
    } else {
        showSubmitBtn(); 
    }
}
function showSubmitBtn() {
    document.getElementById('next-question').style.display = 'none';   
    document.getElementById('submit-btn').style.display = 'block';
}


function winnerResult() {
    const resultDiv = document.querySelector('.result');
    const submitButton = document.getElementById('submit-btn');
    const resultText = document.getElementById('result-text');
    const endButton = document.getElementById('end-btn');
    const restartButton = document.getElementById('restart-btn');
    
    document.querySelector('.question-form').style.display = 'none';
    resultDiv.style.display = 'block';
    submitButton.style.display = 'none';

    const resultMessage = `${players[0]} scored ${player1Score} points. ${players[1]} scored ${player2Score} points.`;
    if (player1Score > player2Score) {
        resultText.textContent = resultMessage + ` Player 1 (${players[0]}) is the winner!`;
    } else if (player2Score > player1Score) {
        resultText.textContent = resultMessage + ` Player 2 (${players[1]}) is the winner!`;
    } else {
        resultText.textContent = resultMessage + "They both are got 0 points";
    }
    endButton.style.display = 'block';
    restartButton.style.display = 'block';
}

function playAgain() {
    currentIndex = 0;
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 0;

    document.querySelector('.result').style.display = 'none';
    document.getElementById('end-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';

    document.querySelector('.player-form').style.display = 'block';
    document.getElementById('player1').value = ''; 
    document.getElementById('player2').value = '';
      // Hide category and question forms
      document.querySelector('.category-form').style.display = 'none';
      document.querySelector('.question-form').style.display = 'none';
}
function EndGameFn() {
    alert("Thanks for playing the game!");

}
const submitButton = document.getElementById('submit-btn');
submitButton.addEventListener('click', winnerResult);
