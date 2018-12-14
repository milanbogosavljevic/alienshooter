/**
 * Created by Milan on 6/28/2016.
 */


this.system = this.system || {};
(function(){
    "use strict";

    var Weather = function(game,speed){
        this.Container_constructor();
        this.initializeWeather(game,speed);
    };

    var p = createjs.extend(Weather,createjs.Container);

    p.game = null;
    p.gameWidth = null;
    p.gameHeight = null;
    p.cloudSpeed = null;

    p.initializeWeather = function(game,speed) {
        console.log("Weather initialize");

        this.game = game;
        this.cloudSpeed = speed;
        this.gameWidth = system.AbstractGame.GAME_WIDTH;
        this.gameHeight = system.AbstractGame.GAME_HEIGHT;
     };

    p.addClouds = function(numOfClouds){
        var clouds = [];
        for(var i = 0; i < numOfClouds; i++){
            var cloud = system.Assets.getImage("cloud");
            cloud.regX = cloud.image.width/2;
            this.game.optimize(cloud);
            clouds.push(cloud);
            this.addChild(cloud);
        }
        this.rearangeClouds(clouds);
    };

    p.rearangeClouds = function(clouds){
        var that = this;
        clouds.map(function(cloud){
            cloud.x = Math.random() * that.gameWidth;
            cloud.y = (Math.random() * -500)-that.gameHeight;
            cloud.scaleX = cloud.scaleY = (Math.random() * 2) + 0.4;
        });
        this.moveClouds(clouds);
    };

    p.moveClouds = function(clouds){
        var numOfClouds = clouds.length;
        var counter = 0;
        var that = this;
        clouds.map(function(cloud){
            var y = (Math.random() * that.gameHeight) + that.gameHeight;
            createjs.Tween.get(cloud).to({y: y} , that.cloudSpeed).call(function(){
                counter++;
                if(counter == numOfClouds){
                    that.rearangeClouds(clouds);
                }
            });
        });
    };


    system.Weather = createjs.promote(Weather,"Container");

})();


