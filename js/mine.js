/*
 * Minersweeper demo game
 * @Copyright 2016 (C) Matias Fuentes
 *
 */
if (__private__ == undefined)
    var __private__ = new WeakMap();


let buttonPosition = [];

var gameInstance = null;

// Game class - contains almost everything.- not proud ;(
class Game {

    constructor() {

        if (gameInstance != null)
            return gameInstance;

        // Make my stuff private
        let gameBoardPrivateData = {

            // Get some html content for differente screens and navigation.
            gameContainer: $('#game'),
            board: $('#game-board'),
            gameOverScreen: $('#game-over-screen'),
            winScreen: $('#win-screen'),
            flagInfo: $('#game-flags'),

            // Set up the board stuff
            boardSize: 10,
            minesAmount: 15,
            flagsAmount: 15,

            // Arrays to contain the mines, buttons and the neighbours from the buttons
            minesContainer: [],
            buttonContainer: [],
            neighboursPosition: [],

            // Get some html content for functionality with buttons and navigation
            restartGameBtn: $('#restart-game'),
            playAgainBtn: $('#play-again-btn'),
            backToMenuBtnGO: $('#back-to-menu-btn-go'),
            playAgainBtnWin: $('#play-again-btn-win'),

            // Get the content of the game timer
            gameTimer: $('#game-timer'),

            // Store the info about if the game should finish
            isGameOver: false,

            // Store the amount of flags on mines
            actualFlagSelectedCount: 0,

            // Store the info about if the player won
            win: false,
        };
        __private__.set(this, gameBoardPrivateData);

    }

    // Initializate the game board
    _initGameBoard() {

        let game = new Game();
        let m = __private__.get(this);
        // Stablish my game over as false
        m.isGameOver = false;

        // Stablish my button Positions as new array of the size of my boardSize
        buttonPosition = new Array(m.boardSize);
        // Show to the player trought the html the amount of flags that he has
        m.flagInfo.html(m.flagsAmount);
        m.restartGameBtn.fadeIn('fast');
        // For statement to create the the game board using "divs" and "buttons"
        for (let row = 0; row < m.boardSize; row++) {

            // Create a "div" on the html document
            let rowDiv = $("<div></div>");

            // Add a class to every button
            $(rowDiv).addClass("game-divs");

            buttonPosition[row] = new Array(m.boardSize);
            // For statement  to create  the "buttons", give a "className" to them and append them as childs of the div created above
            for (let col = 0; col < m.boardSize; col++) {

                // Create a "button" on the html document
                let rowButton = $("<button></button>");
                // Give a className to the buttons
                rowButton.addClass("game-button");
                // Stablis the default button propierties
                rowButton.hasFlag = false;
                rowButton.hasMine = false;
                rowButton.selected = false;
                rowButton.numCount = 0;

                // Append them as childs of the div created above
                rowDiv.append(rowButton);

                // Stablish my buttonPosition as an array of buttons that contain his position in row and col
                buttonPosition[row][col] = rowButton;
                rowButton.rowPosition = row;
                rowButton.colPosition = col;

                // push all my buttons into my buttonContainer array
                m.buttonContainer.push(rowButton);

                // Stablish the use of the left click on the
                rowButton.on('click', function(e) {

                    // When the player clicks on a bomb this reveal all of them
                    let counter = 0;
                    if (rowButton.hasMine) {
                      for (let counter = 0; counter <= m.buttonContainer.length - 1; counter++) {

                        let actualButtonPosition = m.buttonContainer[counter]
                        if (actualButtonPosition.hasMine) {

                            buttonPosition[actualButtonPosition.rowPosition][actualButtonPosition.colPosition].hasMine = true;
                            buttonPosition[actualButtonPosition.rowPosition][actualButtonPosition.colPosition].addClass("game-mine");
                        }
                    }
                }

                    // Call the rest of the funtions that the left click has on the button
                    game._initLeftClickInput(rowButton);
                });

                // Call the functions that the right click has.
                rowButton.on('contextmenu', function() {
                    game._initRightClickInput(rowButton);
                });
            }
            // Append the "div" that already contains the buttons to the game board.
            m.board.append(rowDiv);
        }
    }

    // Method used to generate the game mines.
    _initGenerateMines() {

        let m = __private__.get(this);
        let minesCounter = 0;

        // Do this while my minesCounter is less than my mines amount
        while (minesCounter < m.minesAmount) {

            // Use random to generate a number between 0 and the buttonContainer.lenght
            let randomMine = Math.floor(Math.random() * m.buttonContainer.length);
            let actualButton = m.buttonContainer[randomMine];

            // if that position already have a mine do this
            if (m.buttonContainer[randomMine].hasMine != true) {
                minesCounter++;
                buttonPosition[actualButton.rowPosition][actualButton.colPosition].hasMine = true;
                buttonPosition[actualButton.rowPosition][actualButton.colPosition].addClass("ion-gear-b");

                // Call the method that generate the numbers on the buttons on the sides buttons of the mines
                this._initGenerateNumbers(actualButton);

                // If the button is a mine remove the classes that are not necesary
                if (buttonPosition[actualButton.rowPosition][actualButton.colPosition].hasMine = true)
                {
                  buttonPosition[actualButton.rowPosition][actualButton.colPosition].removeClass("game-flag");
                  buttonPosition[actualButton.rowPosition][actualButton.colPosition].removeClass("game-btn-selected");
                }
                // Eliminate the mine from the button container
                m.buttonContainer.splice(actualButton, 1);
                // Add the mine to the mines container
                m.minesContainer.push(actualButton);
              }
        }
    }

    // Method used to setup the numbers of mines on the sides of the buttons
    _initGenerateNumbers(actualButton) {

        let m = __private__.get(this);

        // Store the col and row info
        let actualRow = actualButton.rowPosition;
        let actualCol = actualButton.colPosition;

        // Change the col and row to generate numbers on the -- side
        actualRow = actualButton.rowPosition - 1;
        actualCol = actualButton.colPosition - 1;
        // Checks if the button is inside of the board, and  if it does not have a mine and a flag
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {

            // Sum 1 to the number Count of the actual button
            buttonPosition[actualRow][actualCol].numCount += 1;
            // Use .data to store the info about if there is a mine near
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the -o side
        actualRow = actualButton.rowPosition - 1;
        actualCol = actualButton.colPosition;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the -+ side
        actualRow = actualButton.rowPosition - 1;
        actualCol = actualButton.colPosition + 1;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the o- side
        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition - 1;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the o+ side
        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition + 1;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the +- side
        actualRow = actualButton.rowPosition + 1;
        actualCol = actualButton.colPosition - 1;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the +o side
        actualRow = actualButton.rowPosition + 1;
        actualCol = actualButton.colPosition;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }

        // Change the col and row to generate numbers on the ++ side
        actualRow = actualButton.rowPosition + 1;
        actualCol = actualButton.colPosition + 1;
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true) {
            buttonPosition[actualRow][actualCol].numCount += 1;
            buttonPosition[actualRow][actualCol].data("nearMines", buttonPosition[actualRow][actualCol].numCount);
        }
    }

    // This method store functionality for the left click
    _initLeftClickInput(actualButton) {


      // store the simple click sound
        var cleanBoxSound = new buzz.sound("sound/1Less.wav", {
            preload: true,
        });

      // store the sound for the mine explosion
        var mineExplosion = new buzz.sound("sound/Explosion.wav", {
            preload: true,
        });

        let m = __private__.get(this);
        let game = new Game();
        // if is game over return nothing
        if (m.isGameOver)
            return;

        // if the button is a flag return nothing
        if (actualButton.hasFlag == true)
            return;

        else {
            // if the button has a mine, play the sound, change the game state to over and hide the restart button
            if (actualButton.hasMine == true) {

                mineExplosion.play();
                m.isGameOver = true;
                m.restartGameBtn.fadeOut('fast');

                // Use a counter to give to the player the enough feedbak
                let seconds = 0;
                let gameCounter = setInterval(function() {
                    if (seconds > 1) {
                        clearInterval(gameCounter);
                        game._initGameOver();
                        seconds = 0;
                    } else
                        seconds++;
                }, 500);
            }
            // if its not a bomb
            else
            {
              // if the actualButton.numCount is less than 1, play the sweep sound and call OpenCells();
              if (actualButton.numCount < 1)
              {
                var sweep = new buzz.sound("sound/Sweep.wav", {
                    preload: true,
                });
                sweep.play();
                this._OpenCells(actualButton);
              }
              // if not, play the simple left click sound, and change the html of the button to the nearMines data, add the button selected class.
             else {
                cleanBoxSound.play();
                actualButton.html(actualButton.data("nearMines"));
                actualButton.addClass("game-btn-selected");
                actualButton.selected = true;
              }
            }
        }
    }

    // Use this method for the button expansion
    _OpenCells(actualButton) {

      let m = __private__.get(this);
      this._getNeighboursBlocks(actualButton);

      for (let i = 0; i < m.neighboursPosition.length; i++) {

          // if my neighboursPosition its not a mine, flag, selected and his numCount < 1
          if (m.neighboursPosition[i].hasMine != true && m.neighboursPosition[i].hasFlag != true && m.neighboursPosition[i].selected != true && m.neighboursPosition[i].numCount < 1 ) {

              // Change the html of the button to the nearMines data, add the button selected class, and change the button to selected.
              actualButton.addClass("game-btn-selected");
              actualButton.selected = true;
              actualButton.html(actualButton.data("nearMines"));

              // Re use this method for the side cubes
              this._OpenCells(m.neighboursPosition[i]);
          }
      }
    }

    // This method get the neighbours blocks and check that there is no mine or flag or its outside of the game box
    _getNeighboursBlocks(actualButton) {

        let m = __private__.get(this);
        let game = new Game();

        let buttonCounter = 0;

        // Store the col and row info
        let actualRow = actualButton.rowPosition;
        let actualCol = actualButton.colPosition;

        // Change the col and row to generate numbers on the -- side
        actualRow = actualRow - 1;
        actualCol = actualCol - 1;

        // Checks if the button is inside of the board, and  if it does not have a mine and a flag
        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            // Push the actual buttonPosition to my neighboursPosition array
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the o- side
        actualRow = actualRow - 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the -+ side
        actualRow = actualRow - 1;
        actualCol = actualCol + 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the o+ side
        actualCol = actualCol + 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the o- side
        actualCol = actualCol - 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the +- side
        actualRow = actualRow + 1;
        actualCol = actualCol - 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the +o side
        actualRow = actualRow + 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);

        actualRow = actualButton.rowPosition;
        actualCol = actualButton.colPosition;
        // Change the col and row to generate numbers on the ++ side
        actualRow = actualRow + 1;
        actualCol = actualCol + 1;

        if ((actualRow < m.boardSize && actualRow >= 0) && (actualCol < m.boardSize && actualCol >= 0) && buttonPosition[actualRow][actualCol].hasMine != true && buttonPosition[actualRow][actualCol].hasFlag != true && buttonPosition[actualRow][actualCol].selected != true)
            m.neighboursPosition.push(buttonPosition[actualRow][actualCol]);
    }

    // This method store the functionality for the right click
    _initRightClickInput(actualButton) {

        // store the sound for the flag
        var flag = new buzz.sound("sound/Flag.wav", {
            preload: true,
        })

        let game = new Game();
        let m = __private__.get(this);
        event.preventDefault();

        // if the game is over return nothing
        if (m.isGameOver)
            return;

        // Shows trought the html the flag amount
        m.flagInfo.html(m.flagsAmount);

        // if my button its not flaged, selected and my flags are more than 0
        if (actualButton.hasFlag != true && actualButton.selected != true && m.flagsAmount > 0) {

            // Rest one to my actual flags
            m.flagsAmount = m.flagsAmount - 1;
            // play the flag sound
            flag.play();
            // Call the showFlag method
            game._showFlag(actualButton);

            if (actualButton.hasMine) {
                // if this is true my victory is more near
                m.actualFlagSelectedCount += 1;
                // remove this class because visual bug
                actualButton.removeClass("ion-gear-b");
            }

            // if the amount of mines and flags on them is equal the player wins
        if (m.actualFlagSelectedCount == m.minesAmount) {

              m.flagWin = true;
              game._initWiningScreen();
        }

        }else {
            // if my button have a flag and i pick it up my flag amount is + 1
            if (actualButton.hasFlag) {
                m.flagsAmount = m.flagsAmount + 1;
                // Call the hide flag function
                game._hideFlag(actualButton)
                // if i take one that it was on top of a mine rest one to my victory counter
                if (actualButton.hasMine)
                    m.actualFlagSelectedCount -= 1;
            }
        }
    }

    // This method add a flag to the button and add some classes
    _showFlag(actualButton) {

        let m = __private__.get(this);
        actualButton.addClass('game-flag');
        actualButton.addClass('ion-alert-circled');
        actualButton.hasFlag = true;
    }

    // This method take the flag on the button and remove the classes and the button state of flagged
    _hideFlag(actualButton) {
        let m = __private__.get(this);
        actualButton.removeClass('game-flag');
        actualButton.removeClass('ion-alert-circled');
        actualButton.hasFlag = false;
    }

    // This method is used for the game over
    _initGameOver() {

        let m = __private__.get(this);
        let game = new Game();

        // Hide the game container
        m.gameContainer.fadeOut('fast');
        // Show the game over Screen
        m.gameOverScreen.fadeIn('slow');
        // my game area is empty
        m.board.empty();
        // Reset my game area
        game._initGameBoard();
        game._initGenerateMines();

        // To navigate trought the menu
        m.playAgainBtn.on('click', function(e) {
            m.gameOverScreen.fadeOut('fast');
            m.gameContainer.fadeIn('slow');
        });
    }

    // Use this method if the player win
    _initWiningScreen() {

        let m = __private__.get(this);
        let game = new Game();

        // Hide the game container
        m.gameContainer.fadeOut('fast');
        // show the win screen
        m.winScreen.fadeIn('slow');
        // reset my game area
        m.board.empty();
        game._initGameBoard();
        game._initGenerateMines();

        // To navigate trought the menu
        m.playAgainBtnWin.on('click', function(e) {
            m.winScreen.fadeOut('fast');
            m.gameContainer.fadeIn('slow');
        });
    }

    // Use this method to restart the game
    _initRestartGameBoard() {

        let m = __private__.get(this);
        let game = new Game();

        // if this button is pressed restart the game
        m.restartGameBtn.on('click', function() {
            m.board.empty();
            game._initGameBoard();
            game._initGenerateMines();
            game._initGameTimer();
            m.timer.stop();
        });
    }

    // Game timer (not working properly)
    _initGameTimer() {
        let m = __private__.get(this);
        let game = new Game();

        m.timer = new Timer();
        m.timer.start();
        m.timer.addEventListener('secondsUpdated', function(e) {
            m.gameTimer.html(m.timer.getTimeValues().toString());

            if (m.timer.getTimeValues() > 120 || m.isGameOver != false) {
                m.timer = new Timer();
                m.timer.stop();
            }
        });
    }
}

$(document).ready(() => {
    let game = new Game();
    game._initGameBoard();
    game._initGenerateMines();
    game._initRestartGameBoard();
    game._initGameTimer();
});
