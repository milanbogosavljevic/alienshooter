/**
 * Created by Micika on 05-Dec-15.
 */

this.system = this.system || {};
(function(){
    "use strict";

    var AbstractGame = function(){
        this.Container_constructor();
    };

    var p = createjs.extend(AbstractGame,createjs.Container);
    AbstractGame.GAME_WIDTH = 0;
    AbstractGame.GAME_HEIGHT = 0;



    p.player = null;
    p.playerName = null;
    p.enemy = null;
    p.shootingSystem = null;
    p.ufoShootingSystem = null;
    p.ufoBullet = null;
    p.level = 1;
    p.background = null;
    p.background2 = null;
    p.score = 0;
    p.animation = null;
    //p.hitStreak = 0;
    p.controlBoard = null;
    p.message = null;
    p.info = null;
    p.weather = null;
    p.gameRunning = false;
    p.countdownTimer = null;
    p.bonusActivated = false;
    p.scores = null;
    p.communicator = null;
    p.results = [];

    p.render = function(){
      if(this.shootingSystem.bullet.visible){
          if(this.shootingSystem.bullet.y < this.shootingSystem.enemtY){
              this.checkPlayerHit();
          }
      }
      if(this.ufoBullet.visible){
          if(this.ufoBullet.y > this.player.y){
              this.checkEnemyHit();
          }
      }
      stage.update();
    };

    p.addSheetEffect = function(x,y,sheet,frameCount,singleWidth,height,fps,loop){
        var frames = frameCount-1;
        var data = {
            images: [sheet],
            frames: {regX:singleWidth/2 , regY:height/2 ,width: singleWidth, height: height, count:frameCount},
            animations: {
                animate: [0, frames , loop]
            },
            framerate:fps
        };

        var bmpAnimation = new createjs.SpriteSheet(data);
        var animation = new createjs.Sprite(bmpAnimation,"animate");
        animation.x = x;
        animation.y = y;
        this.optimize(animation);
        return animation;
    };

    p.optimize = function(target){
        target.mouseEnabled = false;
    };
    
    p.deepOptimize = function(target){
      this.optimize(target);
      target.tickEnabled = false;  
    };

    system.AbstractGame = createjs.promote(AbstractGame,"Container");

})();


