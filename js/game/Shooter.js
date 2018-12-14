/**
 * Created by Milan on 12/29/2015.
 */

this.system = this.system || {};
(function(){
    "use strict";

var ShooterGame = function(){
        this.AbstractGame_constructor();
        this.initializeShooterGame();
    };

var p =  createjs.extend(ShooterGame, system.AbstractGame);

    ShooterGame.GAME_WIDTH = 1280;
    ShooterGame.GAME_HEIGHT = 720;

    var instance;

    p.initializeShooterGame = function(){

        console.log("Shooter Game initialize");
        instance = this;

        this.communicator = new system.Communicator(this);

        this.communicator.getResults(function(results){
            for(var i = 0; i < results.length; i++){
                instance.results.push(results[i]);
            }
        });

        system.AbstractGame.GAME_WIDTH = ShooterGame.GAME_WIDTH;
        system.AbstractGame.GAME_HEIGHT = ShooterGame.GAME_HEIGHT;

        var player = this.player = new system.Player(this);
        player.y = 613;
        player.regX = this.player.getBounds().width/2;

        var enemy = this.enemy = new system.Enemy(this);
        enemy.x = 1000;
        enemy.y = 55;

        enemy.regX = this.enemy.getBounds().width/2;
        enemy.regY = this.enemy.getBounds().height/2;

        this.ufoShootingSystem = new system.UfoShooting();

        var ufoBullet = this.ufoBullet = this.ufoShootingSystem.bullet;
        ufoBullet.visible = false;
        this.optimize(ufoBullet);

        var background = this.background = system.Assets.getImage("background");
        background.y = -720;
        this.optimize(background);

        var controlBoard = this.controlBoard = new system.ControlBoard(this);
        controlBoard.x = 0;
        controlBoard.y = 659;

        var countdownTimer = this.countdownTimer = new system.Timer(4,"68px Orbitron");//limit is 5
        countdownTimer.x = 1360;
        countdownTimer.y = 400;
        this.optimize(countdownTimer);
        countdownTimer.visible = false;

        var message = this.message = new createjs.Text("Rocket Ammo","68px Orbitron" , "black");
        var x = (system.AbstractGame.GAME_WIDTH/2) - (message.getMeasuredWidth()/2);
        message.x = x;
        message.y = -50;
        this.optimize(message);
        message.align = "center";
        message.baseline = "alphabetic";
        message.alpha = 0;

        this.shootingSystem = new system.PlayerShootingSystem(this);
        this.shootingSystem.setBulletImage();                                                               // GLUPOST
        this.shootingSystem.setRocketAmmo();
        var bullet = this.shootingSystem.bullet;
        bullet.visible = false;

        var info = this.info = new system.Info();
        info.x = info.y = 0;

        var weather = this.weather = new system.Weather(this,13000);

        this.addChild(
            background,
            controlBoard,
            enemy,
            bullet,
            ufoBullet,
            player,
            weather,
            message,
            countdownTimer,
            info
        );
        info.addEventListener("click",this.handleInfoClick);
        this.playerName = prompt("ENTER YOUR NAME");
        if(!this.playerName){
            this.playerName = "NoName";
        }
    };

    p.startCountdown = function(bool){
      this.countdownTimer.startCountdown(bool);
    };
    
    p.checkBonusFeature = function () {
      if(this.countdownTimer.checkBonusFeature()){
          console.log("ACTIVATE BONUS");
          this.bonusActivated = true;
          this.enemy.freeze = true;
          this.startCountdown(false);
      }
    };

    p.checkPlayerHit = function(){
        console.log("checking player's...");
        this.shootingSystem.checkHit();
    };

    p.checkEnemyHit = function(){
        console.log("checking enemy's...");
        //if(this.ufoBullet.visible){
            //if(this.ufoBullet.y > this.player.y){
                var x = this.player.x;
                var width = this.player.getBounds().width/2;
                if (this.ufoBullet.x > (x-width) && this.ufoBullet.x < (x + width)) {
                    this.ufoBullet.visible = false;
                    this.boom(this.ufoBullet.x,this.ufoBullet.y);
                    if(this.player.hasShield){
                        this.addShield(false);
                    }else {
                        if(this.gameRunning){
                            this.player.fadeAway();
                            this.gameOver();
                        }
                    }
                }
            //}
        //}
    };

    p.handleInfoClick = function(){
        instance.info.removeEventListener("click" , instance.handleInfoClick);
        instance.removeChild(instance.info);
        instance.info = null;
        instance.weather.addClouds(6);
        instance.moveBackground(instance.background,15000);
        //instance.playBackgroundSound("backgroundMusic");
        system.Assets.playBackgroundSound("backgroundMusic");
        instance.gameRunning = true;
        setTimeout(function(){
            instance.player.setClickListener(true);
            instance.enemy.startMoving(500);
            instance.enemy.startShooting(true,instance.enemy.interval);
        },100);
    };

    p.showShieldAdd = function () {
        var that = this;
        var img = system.Assets.getImage("shieldInfo");
        img.x = 400;
        img.y = 200;
        this.optimize(img);
        img.alpha = 0;
        img.scaleX = img.scaleY = 3;
        this.addChild(img);
        createjs.Tween.get(img).to({scaleX:1,scaleY:1,alpha:1},800,createjs.Ease.bounceOut).wait(1000).call(function(){
            that.removeChild(img);
        });
    };

    p.moveBackground = function(ground,speed){
        var pic = ground;
        var speed = speed;

        var move = function(pic,speed){
            createjs.Tween.get(pic).to({y:0},speed).call(function(){
                pic.y = -720;
                move(pic,speed);
            });
        };
        move(pic,speed);
    };

    p.addShield = function(bool){
        if(bool){
            this.showShieldAdd();
        }
      this.player.addShield(bool);
    };

    p.showHideControlBoard = function(){
        var x = this.controlBoard.x == 0 ? -600 : 0;
        createjs.Tween.get(this.controlBoard).to({x:x},500);
    };

    p.showShootingSystemMessage = function(shootingSystem){
        var message = this.message;
        var color = shootingSystem == "laser" ? "red" : "black";
        message.text = shootingSystem + " Ammo";
        message.color = color;
        createjs.Tween.get(message).to({y:350,alpha:1},600).wait(800).to({y:-50,alpha:0},300);
    };

    p.boom = function(x,y) {
        var that = this;
        var sheet = queue.getResult("boom");
        this.optimize(sheet);
        var frameCount = 24;
        var singleWidth = sheet.width/frameCount;
        var height = sheet.height;
        var fps = 30;
        var animation = this.addSheetEffect(x,y,sheet,frameCount,singleWidth,height,fps,false);
        animation.on("animationend", function(e){
            e.remove();
            that.removeChild(animation);
        });
        this.addChild(animation);
        system.Assets.playSound("explode");
    };

    p.ufoShoot = function(x,y){
        var that = this;
        system.Assets.playSound("ufoLaserSound");
        this.ufoBullet.x = x;
        this.ufoBullet.y = y;
        this.ufoBullet.visible = true;

        createjs.Tween.get(this.enemy.gun).to({y: 50} , 50).to({y: 60} , 50);


        createjs.Tween.get(this.ufoBullet).to({y: 720} , this.ufoShootingSystem.bulletSpeed).call(function(){
            that.ufoBullet.visible = false;
            });
        };

    p.updateCombo = function(){
        var visibility = this.shootingSystem.hitStreak > 0 ? true:false;
        var color = this.shootingSystem.name == "rocket" ? "yellow" : "red";
        var hitStreak = this.shootingSystem.hitStreak;
        this.controlBoard.updateCombo(visibility,color,hitStreak);
    };

    p.hit = function(){
        if(!this.countdownTimer.timerIsRunning){
            if(!this.bonusActivated) {
                this.startCountdown(true);
            }
        }else{
            if(!this.bonusActivated){
                this.checkBonusFeature();
            }
        }
        this.shootingSystem.totalHits++;
        this.shootingSystem.bullet.visible = false;
        this.boom(this.shootingSystem.bullet.x,this.shootingSystem.bullet.y);
        this.enemy.bounce();
        if(this.shootingSystem.name == "rocket"){
            this.shootingSystem.hitStreak++;
            var side = this.player.side == "left" ? "right" : "left";
            this.player.showRocket(side,true);
        }else{
            if(!this.player.hasShield ){
                this.shootingSystem.hitStreak++;
            }
        }
        this.updateCombo();
        this.enemy.decreaseHealth();
        this.score += this.shootingSystem.bulletDamage;
        this.controlBoard._scoreTxt.text = this.score;
    };

    p.nextLevel = function(){
        this.gameRunning = false;
        var that = this;
        this.enemy.startShooting(false);
        this.enemy.visible = false;
        this.enemy.removeSmoke();

        setTimeout(function(){
            that.level += 1;
            var int = Math.round(that.enemy.interval/that.level);
            that.enemy.health = that.enemy.startHealth + (50*that.level);
            that.shootingSystem.reload(); 
            that.controlBoard.levelTxt.text = that.level;
            that.enemy.healthTxt.text = that.enemy.health;
            that.enemy.visible = true;
            that.enemy.startShooting(true,int);
            if(that.level == 3){
                that.changeEnemyImage(that.level);
                that.ufoShootingSystem.bulletSpeed = 800;
            }else if(that.level == 6){
                that.ufoShootingSystem.bulletSpeed = 600;
                that.changeEnemyImage(that.level);
            }else if(that.level == 10){
                that.changeEnemyImage(that.level);
                that.ufoShootingSystem.bulletSpeed = 300;
            }
            that.gameRunning = true;
        },500);
        createjs.Tween.get(this).to({alpha: 0} , 500).to({alpha:1} , 500);
    };

    p.changeEnemyImage = function(level){
        var imgName = "ufo" + level;
        var img = system.Assets.getImage(imgName);
        this.optimize(img);
        this.enemy.changeSkin(img);
        this.controlBoard.changeEnemyImage(img);
    };

    p.getAccuracy = function(){
        var onePercent = this.shootingSystem.totalShotsFired/100;
        var acc = Math.round(this.shootingSystem.totalHits/onePercent) || 0;
        return acc;
    };

    p.gameOver = function(){

        this.gameRunning = false;
        var that = this;

        this.enemy.startShooting(false);
        if(this.countdownTimer.timerIsRunning){
            this.startCountdown(false);
        }
        this.shootingSystem.bullet.y = 1100; // kada se ne vrati y desi se da naleti ufo na njega i prijavi hit
        var background = system.Assets.getImage("gameOver");
        background.x = background.y = 0;
        this.addChild(background);
        system.Assets.stopSound("backgroundMusic");
        background.on("click" , function(e){
            e.remove();
            that.restartGame();
            scorePanel.clearAll();
            that.removeChild(background,scorePanel);
        });

        var n = {
            name:this.playerName,
            score:this.score
        };

        if(n.score > this.results[0].score){
            this.results.shift();
            this.results.unshift(n);
            this.results.sort(function(a, b){return a.score - b.score});
            this.communicator.insertResults(this.results);
        }

        var scoreInformations = {
            highscores:this.results,
            totalFired:this.shootingSystem.totalShotsFired,
            totalHits:this.shootingSystem.totalHits,
            accuracy:this.getAccuracy(),
            score:this.score
        };

        var scorePanel = new system.ScorePanel(this,scoreInformations);
        scorePanel.x = 100;
        scorePanel.y = 200;
        this.addChild(scorePanel);

        system.Assets.playBackgroundSound("xFiles");

/*      if(localStorage[this.playerName] === undefined || this.score > localStorage[this.playerName]){                    // getting highscore from localstorage
            localStorage[this.playerName] = this.score;
        }

       var highscore = this.getHighscore();
        var name = highscore[0] || "No Highscore";
        var highScore = highscore[1] || "";
        var highscoreTxt = new createjs.Text("Highscore: " + name + " [" + highScore + "]","60px Orbitron" , "#99bbff");
        width = highscoreTxt.getMeasuredWidth();
        highscoreTxt.x = (ShooterGame.GAME_WIDTH/2)-(width/2);
        highscoreTxt.y = 580;
        this.deepOptimize(highscoreTxt);
        highscoreTxt.textAlign = "left";
        highscoreTxt.textBaseline = "alphabetic";*/
    };

    p.restartGame = function(){
      if(this.level > 2){
          this.changeEnemyImage("");
      }
      this.enemy.health = this.enemy.startHealth;
      this.enemy.healthTxt.text = this.enemy.health;
      this.enemy.removeSmoke();
      this.ufoShootingSystem.bulletSpeed = 1000;
      this.level = 1;
      this.controlBoard.levelTxt.text = this.level;
      this.player.ammo = 10;
      if(this.player.hasShield){
          this.player.addShield(false);
      }
      this.controlBoard.playerAmmoTxt.text = this.player.ammo;
      this.shootingSystem.hitStreak = 0;
      this.score = 0;
      this.shootingSystem.totalHits = 0;
      this.shootingSystem.totalShotsFired = 0;
      this.controlBoard._scoreTxt.text = this.score;
      if(this.controlBoard.comboCount.visible){
          this.controlBoard.comboCount.visible = this.controlBoard.comboCountTxt.visible = false;
      }
      if(this.shootingSystem.name != "rocket"){
          this.shootingSystem.setRocketAmmo();
      }
        if(!this.player.visible){
            this.player.visible = true;
        }
        var that = this;
        setTimeout(function(){
            that.gameRunning = true;
            that.enemy.startShooting(true , that.enemy.interval);
        },100);
        system.Assets.stopSound("xFiles");
        system.Assets.playBackgroundSound("backgroundMusic");
    };

/*    p.getHighscore = function(){                               /////////////////////// getting highscore from localstorage
        var results = [];
        for(var i=0, len=localStorage.length; i<len; i++) {
            var key = localStorage.key(i);
            var value = localStorage[key];
            var result = [key,value];
            results.push(result);
        }
       var highscore = this.checkResults(results);
       return highscore;
    };

    p.checkResults = function(results){
        var highscore = 0;
        var player = [];

        for(var i = 0; i < results.length; i++){
            var x = Number(results[i][1]);
            if(x > highscore){
                highscore = results[i][1];
                player = [results[i][0],results[i][1]];
            }
        }
        return player;
    };*/                                                    ////////////////////////////////

    system.ShooterGame = createjs.promote(ShooterGame, "AbstractGame");
})();