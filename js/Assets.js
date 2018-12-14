/**
 * Created by Conan on 8.10.2016..
 */

this.system = this.system || {};
(function(){
    "use strict";

    var Assets = function(){};

    Assets.getImage = function(name){
        var image = new createjs.Bitmap(queue.getResult(name));
        return image;
    };

    Assets.playBackgroundSound = function(id){
        var sound = createjs.Sound.play(id,{loop:600});
        sound.volume = 0.5;
    };

    Assets.playSound = function(id){
        createjs.Sound.play(id);
    };

    Assets.stopSound = function(id){
        createjs.Sound.stop(id);
    };

    Assets.muteSound = function(bool){
        createjs.Sound.muted = bool;
    };

    system.Assets = Assets;

})();


