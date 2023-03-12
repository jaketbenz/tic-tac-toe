"use strict";

const Player = (sign) => {
	this.sign = sign;

	const getSign = () => {
		return sign;
	};
	return { getSign };
};

const gameBoard = (() => {
	const board = ["", "", "", "", "", "", "", "", ""];
	const setBoard = (i, sign) => {
		if (i > board.length) {
			return;
		}
		board[i] = sign;
	};
	const getBoard = (i) => {
		if (i > board.length) {
			return;
		}
		return board[i];
	};
	const resetBoard = () => {
		for (let i = 0; i < board.length; i++) {
			board[i] = "";
		}
	};
	return { setBoard, getBoard, resetBoard };
})();

const displayController = (() => {
	const gameBox = document.querySelectorAll(".game__box");
	const resetButton = document.querySelector(".reset__button");

	gameBox.forEach((box) => {
		box.addEventListener("click", (e) => {
			if (gameController.gameStatus() || e.target.textContent !== "") {
				return;
			}
			gameController.playGame(parseInt(e.target.dataset.id));
			updateBoard();
		});
	});
	resetButton.addEventListener("click", (e) => {
		gameBoard.resetBoard();
		gameController.resetGame();
		updateBoard();
	});
	const updateBoard = () => {
		for (let i = 0; i < gameBox.length; i++) {
			gameBox[i].textContent = gameBoard.getBoard(i);
		}
	};
})();

const gameController = (() => {
	const player1 = Player("X");
	const player2 = Player("O");
	let round = 1;
	let gameOver = false;

	const playGame = (i) => {
		gameBoard.setBoard(i, getPlayerSign());
		if (getWinner(i)) {
			messageController.setResult(getPlayerSign());
			gameOver = true;
			return;
		}
		if (round === 9) {
			messageController.setResult("draw");
			gameOver = true;
			return;
		}
		round++;
		messageController.setMessage(`Player ${getPlayerSign()}'s turn`);
	};
	const getPlayerSign = () => {
		if (
			round === 1 ||
			round === 3 ||
			round === 5 ||
			round === 7 ||
			round === 9
		) {
			return player1.getSign();
		} else {
			return player2.getSign();
		}
	};
	const getWinner = (i) => {
		const winner = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		return winner
			.filter((combination) => combination.includes(i))
			.some((possibleCombination) =>
				possibleCombination.every(
					(i) => gameBoard.getBoard(i) === getPlayerSign()
				)
			);
	};
	const gameStatus = () => {
		return gameOver;
	};
	const resetGame = () => {
		round = 1;
		gameOver = false;
	};
	return { playGame, gameStatus, resetGame };
})();

const messageController = (() => {
	const messageText = document.querySelector(".message");

	const setMessage = (message) => {
		messageText.textContent = message;
	};
	const setResult = (winner) => {
		if (winner === "draw") {
			setMessage("It's a draw");
		} else {
			setMessage(`Player ${winner} has won`);
		}
	};
	return { setMessage, setResult };
})();
