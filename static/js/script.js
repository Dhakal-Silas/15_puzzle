class PlayGround {
    constructor() {
        this.gameWrapper = this.createDivWithClass("game-wrapper");

        this.textSection = this.createDivWithClass("text-section");
        this.titleSection = this.createDivWithClass("title-section");
        this.titleSection.textContent = "Lets Play 15 Puzzle!"
        this.messageSection = this.createDivWithClass("message-section");
        this.messageSection.textContent = "The art of simplicity is a puzzle of complexity art of simplicity is a puzzle of complexity art of simplicity is a puzzle of complexity";
        this.timerMoveSection = this.createDivWithClass("timer-move-section");
        this.timerSection = this.createDivWithClass("timer-section");
        this.timerSection.textContent = 0 + "s";
        this.timer = 1;
        this.isTimerOn = false;
        this.moveSection = this.createDivWithClass("move-section");
        this.moveSection.textContent = "Moves: 0";
        this.moveCount = 1;
        this.correctCards = [];


        this.buttonSection = this.createDivWithClass("button-section")
        this.newGameButton = document.createElement("button");
        this.newGameButton.classList.add("new-game-button");
        this.newGameButton.textContent = "Play Again";
        this.puzzleCardRow = this.createDivWithClass("puzzle-card-row");


        this.playGround = this.createDivWithClass("play-ground");

        const cardValues = Array.from({ length: 15 }, (_, i) => i + 1);
        for (let i = cardValues.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [cardValues[i], cardValues[randomIndex]] = [cardValues[randomIndex], cardValues[i]];
        }

        let puzzleCardValue = 0;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const puzzleCard = this.createDivWithClass("puzzle-card");
                if (puzzleCardValue < 15) {
                    puzzleCardValue += 1;
                    puzzleCard.dataset.puzzleValue = cardValues[puzzleCardValue - 1];
                    puzzleCard.textContent = cardValues[puzzleCardValue - 1];
                    this.puzzleCardRow.appendChild(puzzleCard);
                } else {
                    puzzleCard.classList.add("empty-puzzle-card");
                    this.puzzleCardRow.appendChild(puzzleCard);
                }
            }
            this.playGround.appendChild(this.puzzleCardRow);
        }


        this.appendChildren(this.gameWrapper, [this.textSection, this.timerMoveSection, this.playGround, this.buttonSection]);
        this.appendChildren(this.textSection, [this.titleSection, this.messageSection]);
        this.appendChildren(this.timerMoveSection, [this.timerSection, this.moveSection]);
        this.appendChildren(this.buttonSection, [this.newGameButton]);
        document.body.appendChild(this.gameWrapper);
    }

    createDivWithClass(className) {
        const element = document.createElement("div");
        element.classList.add(className);
        return element;
    }

    appendChildren(parent, children) {
        children.forEach(child => parent.appendChild(child));
    }

    movePuzzleCard(direction) {
        const emptyCard = document.querySelector(".empty-puzzle-card");
        const puzzleCards = document.querySelectorAll(".puzzle-card");
        const emptyCardIndex = Array.from(puzzleCards).indexOf(emptyCard);
        const isValidMove = (nextIndex) => {
            return nextIndex >= 0 && nextIndex < puzzleCards.length;
        };

        if (direction === "ArrowDown") {
            const nextIndex = emptyCardIndex - 4;
            if (isValidMove(nextIndex)) {
                this.moveSection.textContent = `Moves: ${this.moveCount++}`
                this.swapCards(puzzleCards, emptyCardIndex, nextIndex);
                this.checkCorrectCard()
                this.checkWinning(puzzleCards)
            }
        } else if (direction === "ArrowUp") {
            const nextIndex = emptyCardIndex + 4;
            if (isValidMove(nextIndex)) {
                this.moveSection.textContent = `Moves: ${this.moveCount++}`
                this.swapCards(puzzleCards, emptyCardIndex, nextIndex);
                this.checkCorrectCard()
                this.checkWinning(puzzleCards)

            }
        } else if (direction === "ArrowLeft") {
            const nextIndex = emptyCardIndex + 1;
            if (isValidMove(nextIndex) && nextIndex % 4 !== 0) {
                this.moveSection.textContent = `Moves: ${this.moveCount++}`
                this.swapCards(puzzleCards, emptyCardIndex, nextIndex);
                this.checkCorrectCard()
                this.checkWinning(puzzleCards)


            }
        } else if (direction === "ArrowRight") {
            const nextIndex = emptyCardIndex - 1;
            if (isValidMove(nextIndex) && emptyCardIndex % 4 !== 0) {
                this.moveSection.textContent = `Moves: ${this.moveCount++}`
                this.swapCards(puzzleCards, emptyCardIndex, nextIndex);
                this.checkCorrectCard()
                this.checkWinning(puzzleCards)
            }
        }
    }

    swapCards(puzzleCards, indexA, indexB) {
        const temp = puzzleCards[indexA].cloneNode(true);
        const cardA = puzzleCards[indexA];
        const cardB = puzzleCards[indexB];
        cardB.classList.add("bounce-animation");
        cardB.parentNode.replaceChild(temp, cardB);
        cardA.parentNode.replaceChild(cardB, cardA);
        temp.parentNode.replaceChild(cardA, temp);
        setTimeout(() => {
            cardB.classList.remove("bounce-animation");
        }, 1000);
    }

    updateTimer() {
        if (!this.isTimerOn) {
            this.isTimerOn = true;
            setInterval(() => {
                this.timerSection.textContent = `${this.timer++}s`
            }, 1000)
        }
    }

    checkCorrectCard() {
        const puzzleCards = document.querySelectorAll(".puzzle-card");

        for (let i = 0; i < puzzleCards.length; i++) {
            const card = puzzleCards[i];
            const puzzleValue = parseInt(card.dataset.puzzleValue, 10);
            if (puzzleValue === i + 1) {
                card.classList.add("correct-card")
                if (!this.correctCards.includes(card)) {
                    this.correctCards.push(card)
                }

            }
            else {
                card.classList.remove("correct-card")
                if (this.correctCards.includes(card)) {
                    this.correctCards.pop(card)
                }
            }
        }

    }
    checkWinning(puzzleCards) {
        if (this.correctCards.length == puzzleCards.length - 1) {
            const customDialog = new CustomDialogBox(this.timer,this.moveCount);
            customDialog.show()

        }
    }
}

const p = new PlayGround();

document.addEventListener('keydown', (event) => {
    const arrowKeys = ['ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown'];
    if (arrowKeys.includes(event.key)) {
        p.updateTimer();
        p.movePuzzleCard(event.key);
    }
});

class CustomDialogBox {
    constructor(timer,moves) {
        this.dialog = document.createElement("div");
        this.dialog.id = "custom-dialog";
        this.dialog.classList.add("custom-dialog");
        const content = document.createElement("p");
        content.textContent = `Congratulations, you solved the puzzle in time ${timer} and ${moves} moves!`;
        this.showButton = document.createElement("button");
        this.showButton.textContent = "Play Again";
        this.showButton.addEventListener("click", () => this.show());

        this.dialog.appendChild(content);
        this.dialog.appendChild(this.showButton);

        document.body.appendChild(this.dialog);
    }

    show() {
        this.dialog.style.display = "block";
    }

    hide() {
        this.dialog.style.display = "none";
    }
}

