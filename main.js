//Div variables
const initialContainer = document.querySelector('.initial-screen-container')
const mainContainer = document.querySelector('.main-container')
const nextContainer = document.querySelector('.next-container')
const restartContainer = document.querySelector('.restart-container')

//result elements 
const mainResultContainer = document.querySelector('.main-result-container')
const displayUserName = document.querySelector('#user-name')
const displayUserScore = document.querySelector('#user-score')
let displayUserTime = document.querySelector('#user-time')

//position containers
const positionContainer = document.querySelector('.main-positions-container')

//input value initial screen
let inputName = document.querySelector('#input-name')

//Buttons variables
const buttonContinue = document.querySelector('#initial-continue')
const answerButtonsElement = document.querySelector('.btn-container')
const nextButton = document.querySelector('.btn-next')
const restartButton = document.querySelector('.btn-restart')
const positionsButton = document.querySelector('.btn-positions')
const backButton = document.querySelector('.btn-back')


//Variable where the questions will be displayed
const questionElement = document.getElementById('question')

//Timer + Countdown function
let timeLeft = document.querySelector('#timeLeft')
let countDownTimerId = 0
let currentTime = 0

function countDown() {
    currentTime++
    timeLeft.innerText = currentTime;
}

//score
const score = document.querySelector('#score')
let currentScore = 0

let shuffledQuestions, currentQuestionIndex

buttonContinue.addEventListener('click', () => {

    //Check if input is filled
    if (inputName.value === '') {
        console.warn('Debes ingresar un nombre ')
    } else {
        initialContainer.setAttribute('id', 'hidden')
        startQuiz()
    }
})

nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

restartButton.addEventListener('click', () => {
    initialContainer.removeAttribute('id', 'hidden')
    mainResultContainer.setAttribute('id', 'hidden')
})

positionsButton.addEventListener('click', () => {
    mainResultContainer.setAttribute('id', 'hidden')
    positionContainer.removeAttribute('id', 'hidden')

    populateBoard()
})

backButton.addEventListener('click', () => {
    mainResultContainer.removeAttribute('id', 'hidden')
    positionContainer.setAttribute('id', 'hidden')
})

function startQuiz() {
    //setting score to 0
    currentScore = 0
    score.textContent = currentScore
    //setting time to 0 and starting countdown
    currentTime = 0
    countDownTimerId = setInterval(countDown, 1000);
    //--------------------------------------------
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    mainContainer.removeAttribute('id', 'hidden')
    mainResultContainer.setAttribute('id', 'hidden')

    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')

        if(answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        button.addEventListener('click', () => {
        })
        answerButtonsElement.appendChild(button)
    });
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.setAttribute('id','hidden')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }  
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    //updating score
    if (correct) {
        currentScore ++
        score.textContent = currentScore
        answerButtonsElement.classList.add('disable-buttons')
    }
    //cheking for last question
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.removeAttribute('id', 'hidden')
        nextContainer.removeAttribute('id', 'hidden')
    } else {
        clearInterval(countDownTimerId)
        mainContainer.setAttribute('id', 'hidden')
        mainResultContainer.removeAttribute('id', 'hidden')

        //showing user values
        displayUserName.textContent = inputName.value
        displayUserScore.textContent = currentScore
        displayUserTime.textContent = currentTime

        //updating position table
        setUsersPositions()

        //removing background color in the result container
        setTimeout(() => {
            document.body.removeAttribute('id', 'wrong-button')
            document.body.removeAttribute('id', 'correct-button')
        }, 2000)
    }
}

function setStatusClass(element, correct) {
    //desactivating buttons when the user has answered
    answerButtonsElement.classList.add('disable-buttons')
    if (correct) {
        element.setAttribute('id', 'correct-button')

    } else {
        element.setAttribute('id', 'wrong-button')
    }
}

function clearStatusClass(element) {
    answerButtonsElement.classList.remove('disable-buttons')
    element.removeAttribute('id', 'correct-button')
    element.removeAttribute('id','wrong-button')
}

//users Positions
let userNames = []
let points = []
let timeSpent = []

function setUsersPositions() {
    userNames.push(inputName.value)
    points.push(currentScore)
    timeSpent.push(currentTime)

    sortItems(points, userNames)
}

function populateBoard() {
    //deleting past table position
    let board = document.querySelector('.position-table')
    board.innerHTML = ""

    for (let i = 0; i < userNames.length; i ++) {

        let row = board.insertRow()
        let cell = row.insertCell()
        let cell2 = row.insertCell()
        let cell3 = row.insertCell()

        cell.innerText = i + 1
        cell2.innerText = userNames[i]
        cell3.innerText = points[i]

        /* board.insertAdjacentText('beforeend', ' ' + `${userNames[i]} => ${points[i]} |`);
        let linebreak = document.createElement("br");
        board.appendChild(linebreak) */
    }
}


//Sort items 
function sortItems(pointsSwapped, namesSwapped) {
	for (let i = 0; i < pointsSwapped.length; i++) {
		for (let j = 0; j < pointsSwapped.length; j++) {
			if (pointsSwapped[j] > pointsSwapped[j + 1]) {

                let temp = namesSwapped[j];
                namesSwapped[j] = namesSwapped[j + 1];
                namesSwapped[j + 1] = namesSwapped
				namesSwapped[j + 1] = temp;

				let temp2 = pointsSwapped[j];
				pointsSwapped[j] = pointsSwapped[j + 1];
                pointsSwapped[j + 1] = pointsSwapped
				pointsSwapped[j + 1] = temp2;

			}
		}
	}
	userNames = namesSwapped.reverse(), 
    points = pointsSwapped.reverse();

    console.log(userNames, points)
}

const questions = [
    {
        question: 'Who created Javascript?',
        answers: [
            { text: 'Brendan Eich', correct: true},
            { text: 'Mark Zuckerberg', correct: false},
            { text: 'Mitchell Baker', correct: false},
            { text: 'James Gosling', correct: false}
        ]
    },
    {
        question: "What's 11110 (binary) converted into a decimal number?",
        answers: [
            { text: '25', correct: false},
            { text: '60', correct: false},
            { text: '40', correct: false},
            { text: '30', correct: true}
        ]
    },
    {
        question: 'What is border radius?',
        answers: [
            { text: 'A life style', correct: false},
            { text: 'The meaning of life', correct: false},
            { text: 'A hobby', correct: false},
            { text: 'A CSS property', correct: true}
        ]
    },
    {
        question: 'What does HTML stand for?',
        answers: [
            { text: ' Hyper Trainer Marking Language', correct: false},
            { text: 'Hyper Text Markup Language', correct: true},
            { text: 'Hyper Text Markup Leveler', correct: false},
            { text: 'Hyper Text Marketing Language', correct: false}
        ]
    },
    {
        question: 'What is the only thing that computers understand?',
        answers: [
            { text: 'High Level Languages', correct: false},
            { text: 'Algorithms', correct: false},
            { text: 'Machine Code', correct: true},
            { text: 'Low Level Languages', correct: false}
        ]
    },
    {
        question: 'Before a computer can understand a program it must be...',
        answers: [
    
            { text: 'Written in paper', correct: false},
            { text: 'Translated into a high level language.', correct: false},
            { text: 'Translated into a low level language.', correct: false},
            { text: 'Translated into its machine code.', correct: true}
        ]
    },
    {
        question: 'A list of instructions that enable a computer to perform a specific task is a...',
        answers: [
    
            { text: 'Binary Code', correct: false},
            { text: 'Machine Code', correct: false},
            { text: 'Computer Program', correct: true},
            { text: 'Algorithm', correct: false}
        ]
    },
    {
        question: 'Resolving errors in a program is known as...',
        answers: [
    
            { text: 'Refixing', correct: false},
            { text: 'Problem Solving', correct: false},
            { text: 'Error Checking', correct: false},
            { text: 'Debugging', correct: true}
        ]
    },
    {
        question: 'What is the smallest unit of measurement used to quantify computer data. ?',
        answers: [
    
            { text: 'A byte', correct: false},
            { text: 'a bridle', correct: false},
            { text: 'A bit', correct: true},
            { text: 'marble', correct: false}
        ]
    },
    {
        question: 'Is JavaScript the same language as Java?',
        answers: [
    
            { text: 'Yes', correct: false},
            { text: "I don't know", correct: false},
            { text: "I'm not sure", correct: false},
            { text: 'No', correct: true}
        ]
    }

]