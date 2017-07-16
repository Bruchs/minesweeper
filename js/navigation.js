/*
 * Minersweeper demo game
 * @Copyright 2016 (C) Matias Fuentes
 *
 */

if(__private__ == undefined)
  var __private__ = new WeakMap();

var navigationInstance = null;

class Navigation {

  constructor() {

    if(navigationInstance != null)
      return navigationInstance;

   let gameStartPrivateData = {

      gameContainer : $('#game'),
      splashScreen : $('#splash-screen'),
      howToPlayScreen : $('#how-to-play-screen'),
      gameOverScreen : $('#game-over-screen'),

      startGameBtn : $('#start-game-btn'),
      howToPlayBtn : $('#how-to-play-btn'),
      backToMenuBtn : $('#back-to-menu-btn'),
      backToMenuBtnGO : $('#back-to-menu-btn-go'),
      backToMenuBtnWin : $('#back-to-menu-btn-win'),
      restarGameBtn : $('#restart-game'),
      winScreen : $('#win-screen'),

      restarGameBtnClick : false,
    };
    __private__.set( this, gameStartPrivateData );
 }

  _initStartNavigation() {

  	// Store the background music used for the main menu.
    var mainMenuMusic = new buzz.sound("sound/MainMenu.wav",{
      // Set the mainMenuMusic options.
      preload: true,
      autoplay: true,
      loop: true
    });

    var gameLoopMusic = new buzz.sound("sound/GameLoop.wav", {

      preload: true,
      loop : true,
    });

  	let p = __private__.get(this);

    p.startGameBtn.on('click', function() {

      p.gameContainer.fadeIn('slow');
      p.splashScreen.fadeOut('fast');
      mainMenuMusic.stop();
      gameLoopMusic.play();
    });

     p.howToPlayBtn.on('click', function() {

      p.howToPlayScreen.fadeIn('slow');
      p.splashScreen.fadeOut('fast');
    });

    p.backToMenuBtn.on('click', function() {

      p.splashScreen.fadeIn('slow');
      p.howToPlayScreen.fadeOut('fast');
      gameLoopMusic.stop();
      mainMenuMusic.play()
    });

    p.backToMenuBtnGO.on('click', function() {

      p.gameOverScreen.fadeOut('fast');
      p.splashScreen.fadeIn('slow');
      gameLoopMusic.stop();
      mainMenuMusic.play()
    });

    p.backToMenuBtnWin.on('click', function() {

      p.winScreen.fadeOut('fast');
      p.splashScreen.fadeIn('slow');
      gameLoopMusic.stop();
      mainMenuMusic.play()
    });
  }
}

$(document).ready( ()=> {
  let navigation = new Navigation();
  navigation._initStartNavigation();
});
