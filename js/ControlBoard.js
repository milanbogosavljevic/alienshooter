/**
 * Created by Micika on 15-Feb-16.
 */

this.system = this.system || {};
(function(){
    "use strict";

    var ControlBoard = function(game){
        this.Container_constructor();
        this.initializeControlBoard(game);
    };

    var p = createjs.extend(ControlBoard,createjs.Container);

    p.game = null;
    p._ammoBarLaser = null;
    p.playerAmmoTxt = null;
    p.levelTxt = null;
    p.comboCount = 0;
    p.comboCountTxt = null;
    p._scoreTxt = null;
    p.enemySmallIcon = null;
    p.soundOn = null;
    p.soundOff = null;

    p.initializeControlBoard = function(game) {
        console.log("ControlBoard initialize");
        this.game = game;
        this.setBackground();
        this.setEnemyHealthComponent();
        this.setAmmoComponent();
        this.setLevelComponent();
        this.setComboComponent();
        this.setScoreComponent();
    };

    p.switchSoundIcons = function(bool){
      this.soundOff.visible = bool;
      this.soundOn.visible = !bool;
    };

    p.setBackground = function () {
        var background = system.Assets.getImage("result");
        background.x = 0;
        background.y = 0;
        this.game.deepOptimize(background);

        var soundOn = this.soundOn = system.Assets.getImage("soundOn");
        soundOn.x = 1220;
        soundOn.y = 10;
        this.game.optimize(soundOn);

        var soundOff = this.soundOff = system.Assets.getImage("soundOff");
        soundOff.x = 1220;
        soundOff.y = 10;
        this.game.optimize(soundOff);
        soundOff.visible = false;

        this.addChild(background,soundOn,soundOff);
    };

    p.setEnemyHealthComponent = function () {
        var healthBar = system.Assets.getImage("healthBar");
        healthBar.x = 270;
        healthBar.y = 8;
        this.game.deepOptimize(healthBar);

        var enemySmallIcon = this.enemySmallIcon = system.Assets.getImage("ufo");
        enemySmallIcon.scaleX = enemySmallIcon.scaleY = 0.4;
        enemySmallIcon.x = healthBar.x + 8;
        enemySmallIcon.y = healthBar.y + 6;
        this.game.optimize(enemySmallIcon);

        var enemyHealth = this.game.enemy.healthTxt = new createjs.Text(this.game.enemy.health, "23px Orbitron" , "white");
        enemyHealth.x = healthBar.x + 85;
        enemyHealth.y = healthBar.y + 30;
        enemyHealth.textBaseline = "center";
        enemyHealth.textAlign = "center";
        this.game.optimize(enemyHealth);

        this.addChild(healthBar,enemySmallIcon,enemyHealth);
    };
    
    p.setAmmoComponent = function () {
        var ammoBar = system.Assets.getImage("ammoBar");
        ammoBar.x = 5;
        ammoBar.y = 8;
        this.game.deepOptimize(ammoBar);

        var ammoBarLaser = this._ammoBarLaser = system.Assets.getImage("ammoBarLaser");
        ammoBarLaser.x = ammoBar.x;
        ammoBarLaser.y = ammoBar.y;
        this.game.optimize(ammoBarLaser);
        ammoBarLaser.visible = false;

        var ammo = this.playerAmmoTxt = new createjs.Text(this.game.player.ammo, "33px Orbitron" , "white");
        ammo.x = ammoBar.x + 85;
        ammo.y = ammoBar.y + 35;
        this.game.optimize(ammo);
        ammo.textBaseline = "center";
        ammo.textAlign = "center";
        
        this.addChild(ammoBar,ammoBarLaser,ammo);
    };
    
    p.setLevelComponent = function () {
        var levelBar = system.Assets.getImage("levelBar");
        levelBar.x = 440;
        levelBar.y = 8;
        this.game.deepOptimize(levelBar);

        var level = this.levelTxt = new createjs.Text(this.game.level, "33px Orbitron" , "white");
        level.x = levelBar.x + 85;
        level.y = levelBar.y + 35;
        this.game.optimize(level);
        level.textBaseline = "center";
        level.textAlign = "center";
        
        this.addChild(levelBar,level);
    };
    
    p.setComboComponent = function () {
        var comboCount = this.comboCount = new createjs.Text("", "40px Orbitron" , "yellow");
        comboCount.x = 90;
        comboCount.y = -55;
        this.game.optimize(comboCount);
        comboCount.visible = false;

        var comboCountTxt = this.comboCountTxt = new createjs.Text("combo", "40px Orbitron" , "yellow");
        comboCountTxt.x = 30;
        comboCountTxt.y = -100;
        this.game.optimize(comboCountTxt);
        comboCountTxt.visible = false;
        
        this.addChild(comboCount,comboCountTxt);
    };
    
    p.setScoreComponent = function () {
        var score = this._scoreTxt = new createjs.Text("0", "23px Orbitron" , "yellow");
        score.x = 200;
        score.y = 38;
        this.game.optimize(score);
        score.textBaseline = "center";
        score.textAlign = "center";
        this.addChild(score);
    };

    p.updateCombo = function(visibility,color,hitStrak){
        this.comboCount.text = hitStrak;
        this.comboCount.color = this.comboCountTxt.color = color;
        createjs.Tween.get(this.comboCount).to({scaleX:4,scaleY:4},150).to({scaleX:1,scaleY:1},150);
        this.comboCount.visible = this.comboCountTxt.visible = visibility;
    };
    
    p.changeEnemyImage = function (img) {
      this.enemySmallIcon.image = img.image;
    };

    system.ControlBoard = createjs.promote(ControlBoard,"Container");

})();