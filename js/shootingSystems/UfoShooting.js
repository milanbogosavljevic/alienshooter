/**
 * Created by Micika on 16-Feb-16.
 */


this.system = this.system || {};
(function(){
    "use strict";

    var UfoShooting = function(){
        this.initializeUfoShooting();
    };

    var p = UfoShooting.prototype;


    p.initializeUfoShooting = function() {
        console.log("UfoShooting initiallize");
        this.name = "UfoShooting";
        this.bulletSpeed = 1000;
        this.bullet = new createjs.Shape();
        this.bullet.graphics.beginFill("#00ff55").drawRect(0,0,5,20);
        this.bullet.regX = 2.5;
        this.bullet.regY = 20;
    };

    system.UfoShooting = UfoShooting;

})();



