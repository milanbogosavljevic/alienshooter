
this.system = this.system || {};
(function(){
    "use strict";

    var PlayerShootingSystem = function(game){
        this.initializeShootingSystem(game);
    };

    var p = PlayerShootingSystem.prototype;

    p.game = null;
    p.bullet = null;
    p.bulletDamage = null;
    p.bulletSpeed = null;
    p.name = null;
    p.totalShotsFired = 0;
    p.totalHits = 0;
    p.hitStreak = 0;
    p.enemtY = 0;

    p.initializeShootingSystem = function(game) {
        console.log("PlayerShootingSystem initiallize");
        this.game = game;
        this.enemtY = this.game.enemy.y + (this.game.enemy.getBounds().height/2);
    };

    p.checkHit = function(){
        //if(this.bullet.y < this.enemtY/* && this.bullet.visible*/){
            var widthHalf = this.game.enemy.getBounds().width/2;
            if (this.bullet.x > (this.game.enemy.x - widthHalf) && this.bullet.x < (this.game.enemy.x + widthHalf)) {
                this.game.hit();
                if(this.hitStreak === 3){
                    //this.game.playSound("niceShooting");
                    system.Assets.playSound("niceShooting");
                    if(this.name == "rocket"){
                        this.setLaserAmmo();
                        this.hitStreak = 0;
                        this.game.updateCombo();
                    }else{
                        this.game.addShield(true);
                        this.hitStreak = 0;
                        this.game.updateCombo();
                    }
                }
            }
        //}
    };

    p.shoot = function(x,y){
        this.totalShotsFired++;
        this.bullet.visible = true;
        this.bullet.x = x;
        this.bullet.y = y;
        var shootMethod = this.name + "Shoot";
        this[shootMethod]();
    };

    p.rocketShoot = function () {
        var that = this;
        var side;
        var x;
        var rotation;
        if(that.game.player.side == "left"){
            side = "left";
            x = this.bullet.x - 50;
            rotation = 10;
        }else{
            x = this.bullet.x + 50;
            rotation = -10;
            side = "right";
        }
        createjs.Tween.get(this.bullet).to({x:x,rotation:rotation,scaleX:0.7,scaleY:0.7},180).to({y: -20,x:this.bullet.x,rotation:0,scaleX:1,scaleY:1},this.bulletSpeed).call(function(){
            if(that.bullet.visible){
                that.game.player.showRocket(side,true);
                that.miss();

            }
        });
    };

    p.laserShoot = function () {
        var that = this;
        createjs.Tween.get(this.bullet).to({y: -20},this.bulletSpeed).call(function(){
            if(that.bullet.visible){
                that.setRocketAmmo();
                that.miss();
            }
        });
    };

    p.miss = function () {
        if(this.hitStreak > 0){
            this.hitStreak = 0;
            this.game.updateCombo();
        }
        this.bullet.visible = false;
        if(this.game.countdownTimer.timerIsRunning){
            this.game.startCountdown(false);
        }
    };

    p.setBulletImage = function(){
        //this.bullet = new createjs.Bitmap(queue.getResult("missile"));
        this.bullet = system.Assets.getImage("missile");
        this.game.optimize(this.bullet);
    };

    p.setRocketAmmo = function(){
        this.name = "rocket";
        this.game.showShootingSystemMessage(this.name);
        this.game.controlBoard._ammoBarLaser.visible = false;
        this.bulletDamage = 50;
        this.bulletSpeed = 600;
        this.bullet.image = system.Assets.getImage("missile").image;
        this.bullet.regX = this.bullet.image.width/2;
    };

    p.setLaserAmmo = function(){
        this.name = "laser";
        this.game.showShootingSystemMessage(this.name);
        this.game.controlBoard._ammoBarLaser.visible = true;
        this.bulletDamage = 100;
        this.bulletSpeed = 300;
        this.bullet.image = system.Assets.getImage("laser").image;
        this.bullet.regX = this.bullet.image.width/2;
    };

    p.updateAmmo = function(){
        this.game.player.ammo -= 1;
        this.game.controlBoard.playerAmmoTxt.text = this.game.player.ammo;
    };

    p.reload = function(){
        this.game.player.ammo = 10;
        this.game.controlBoard.playerAmmoTxt.text = this.game.player.ammo;
    };

    system.PlayerShootingSystem = PlayerShootingSystem;

})();