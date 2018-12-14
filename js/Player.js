
this.system = this.system || {};
(function(){
    "use strict";

    var Player = function(game){
        this.Container_constructor();
        this.initializePlayer(game);
    };

    var p = createjs.extend(Player,createjs.Container);
    p.body = null;
    p.game = null;
    p.ammo = 10;
    p.oldX = 0;
    p.shield = null;
    p.hasShield = false;
    p.leftRocket = null;
    p.rightRocket = null;
    p.side = "left";

    p.initializePlayer = function(game) {
        console.log("Player initialize");
        this.game = game;
        var that = this;
        var leftRocket = this.leftRocket = system.Assets.getImage("missile");
        leftRocket.x = 10;
        leftRocket.y = 40;
        this.game.optimize(leftRocket);
        var rightRocket = this.rightRocket = system.Assets.getImage("missile");
        rightRocket.x = 40;
        rightRocket.y = 40;
        this.game.optimize(rightRocket);
        var body = this.body = system.Assets.getImage("soldier");
        this.game.optimize(body);
        this.addChild(leftRocket,rightRocket,body);

        var gameStage = document.getElementById("gameStage");
        gameStage.addEventListener("mousemove", function(evt) {

            if(stage.mouseX > that.oldX){
                that.oldX = stage.mouseX;
                that.skewY = 10;
            }else if(stage.mouseX < that.oldX){
                that.oldX = stage.mouseX;
                that.skewY = -10;
            }else{
                that.skewY = 0;
            }
            that.moveBody(stage.mouseX);
        });
    };

    p.showRocket = function(side,bool){
        var rocket = side + "Rocket";
        this[rocket].visible = bool;
    };

    p.setClickListener = function(){
        var that = this;
        var gameStage = document.getElementById("gameStage");
        gameStage.addEventListener("click" , function(){
            if(!that.game.shootingSystem.bullet.visible && that.game.gameRunning){
                if(that.ammo > 0){
                    var y = that.y+50;
                    var x = that.x;
                    that.game.shootingSystem.updateAmmo();
                    if(that.game.shootingSystem.name == "rocket"){                   
                        var side = that.side == "left" ? "right" : "left";
                        that.game.shootingSystem.shoot(x , y);
                        that.showRocket(that.side,false);
                        that.side = side;
                        system.Assets.playSound("rocketSound");
                    }else{
                        that.game.shootingSystem.shoot(x , y);
                        system.Assets.playSound("laserSound");
                    }
                }else{
                    if(that.game.gameRunning){
                        that.game.gameOver();
                    }
                }
            }
        });
        gameStage.addEventListener( "contextmenu", function() {
            var bool = !createjs.Sound.muted;
            that.game.controlBoard.switchSoundIcons(bool);
            system.Assets.muteSound(bool);
        });
    };

    p.moveBody = function(x){
      if(x < (system.AbstractGame.GAME_WIDTH - this.body.image.width/2) && x > (this.body.image.width/2)){
          this.x = x;
      }
    };

    p.addShield = function(bool){
      this.hasShield = bool;
      var source = bool == true ? "shield" : "soldier";
      var img = system.Assets.getImage(source);
      this.game.optimize(img);
      this.body.image = img.image;
    };

    p.fadeAway = function(){
        this.visible = false;
    };

    system.Player = createjs.promote(Player,"Container");

})();


