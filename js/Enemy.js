/**
 * Created by Micika on 11-Dec-15.
 */

this.system = this.system || {};
(function(){
    "use strict";

    var Enemy = function(game){
        this.Container_constructor();
        this.initializeEnemy(game);
    };

    var p = createjs.extend(Enemy,createjs.Container);

    p.body = null;
    p.game = null;
    p.health = 100;
    p.startHealth = 100;
    p.healthTxt = null;
    p.shootingInterval = null;
    p.interval = null;
    p.smokeAnimation = null;
    p.freeze = false;
    p.gun = null;

    p.initializeEnemy = function(game) {
        console.log("Enemy initialize");
        this.game = game;
        var body = this.body = system.Assets.getImage("ufo");
        this.game.optimize(body);
        var gun = this.gun = system.Assets.getImage("gun");
        this.game.optimize(gun);
        gun.x = 28;
        gun.y = 60;
        this.interval = 6000;
        this.addChild(gun,body);

    };

    p.freezeImage = function(time){
      system.Assets.playSound("bonus");
      var src = this.body.image.src;
      var name = src.slice(44,-4);
      var that = this;
      var source = name+"freeze";
      var img = system.Assets.getImage(source);
      this.game.optimize(img);  
      this.addChildAt(img,2);
      createjs.Tween.get(img).to({alpha:0},time).call(function(){
          that.game.bonusActivated = false;
          that.removeChild(img);
          img = null;
      });

    };

    p.addSmoke = function(x,y){
        var sheet = queue.getResult("smoke");
        var frameCount = 32;
        var singleWidth = sheet.width/frameCount;
        var height = sheet.height;
        var fps = 30;
        var animation = this.smokeAnimation = this.game.addSheetEffect(x,y,sheet,frameCount,singleWidth,height,fps,true);
        animation.scaleX = animation.scaleY = 2;
        animation.rotation = 180;
        this.addChild(animation);
    };

    p.removeSmoke = function(){
        if(this.contains(this.smokeAnimation)){
            this.removeChild(this.smokeAnimation);
        }
    };

    p.startShooting = function(bool,interval){                  // problem je kada se desi da bude gameOver a posle toga player ima hit
        var that = this;
        if(bool == true){
            this.shootingInterval = setInterval(function(){
                that.game.ufoShoot(that.x , that.y+30)
            },interval);
        }else{
            clearInterval(this.shootingInterval);
            this.shootingInterval = null;
        }
    };

    p.startMoving = function(oldX){

        var x;
        var that = this;
        var half = system.AbstractGame.GAME_WIDTH / 2;
        if(this.x > half){
            this.skewY = -10;
            x = half - (Math.random() * half);
        }else{
            this.skewY = 10;
            x = half + (Math.random() * half);
        }

        var s;

        if(oldX > x){
            s = oldX-x;
        }else{
            s = x-oldX;
        }
        s = Math.round(s);

        var rand = Math.round(500+(Math.random() * 1000));
        var speed = rand + s;

        if(this.freeze){
            x = oldX;
            this.freezeImage(speed);
            this.freeze = false;
        }

        createjs.Tween.get(this).to({x: x} , speed,createjs.Ease.getPowInOut(2)).call(function(){
            that.startMoving(x);
        });
    };

    p.decreaseHealth = function(){
        this.health -= this.game.shootingSystem.bulletDamage;

        if(this.health <= 0){
            this.healthTxt.text = 0;
            this.game.nextLevel();
        }else{
            if(this.health <= ((this.startHealth + (50*this.game.level))/2)){
                if(!this.contains(this.smokeAnimation)){
                    this.addSmoke(50,80);
                }
            }
            this.healthTxt.text = this.health;
        }
    };

    p.bounce = function(){
      createjs.Tween.get(this).to({y:10},150).to({y:62},150).to({y:55},150);
    };

    p.changeSkin = function (img) {
      this.body.image = img.image;
    };

    system.Enemy = createjs.promote(Enemy,"Container");

})();