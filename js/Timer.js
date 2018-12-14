/**
 * Created by Milan on 7/25/2016.
 */

this.system = this.system || {};
(function(){
    "use strict";

    var Timer = function(limit,font){
        this.Container_constructor();
        this.initializeTimer(limit,font);
    };

    var p = createjs.extend(Timer,createjs.Container);
    p.mSeconds = 0;
    p.seconds = 0;
    p.limitSeconds = 0;
    p.secondsTxt = null;
    p.mSecondsTxt = null;
    p.int = null;
    p.timerIsRunning = false;

    p.initializeTimer = function(limit,font) {
        console.log("Timer initialize");
        this.limitSeconds = limit;
        this.setStartTimer(font);
    };

    p.setStartTimer = function(font){
      var sec = this.secondsTxt = new createjs.Text(this.seconds,font , "white");
      sec.textAlign = "right";
      sec.textBaseline = "alphabetic";
      sec.mouseEnabled = false;
      var divider = new createjs.Text(":",font , "white");
      divider.textAlign = "center";
      divider.textBaseline = "alphabetic";
      divider.mouseEnabled = false;
      var mili = this.mSecondsTxt = new createjs.Text(this.mSeconds,font , "white");
      mili.textAlign = "left";
      mili.textBaseline = "alphabetic";
      mili.mouseEnabled = false;
      divider.x = sec.x + 20;
      divider.y = sec.y-5;
      mili.x = divider.x + 20;
      this.addChild(sec,divider,mili);

    };

    p.restartTimer = function(){
      this.mSeconds = 0;
      this.seconds = 0;
    };

    p.refreshTimer = function(){
        this.secondsTxt.text = this.seconds;
        this.mSecondsTxt.text = this.mSeconds;
    };

    p.startCountdown = function(bool){
        var x = bool == true ? 1100 : 1360;
        createjs.Tween.get(this).to({x:x,visible:bool},300);
        var that = this;
        this.timerIsRunning = bool;
        if(bool){
            this.int = setInterval(function(){
                that.mSeconds += 10;
                if(that.mSeconds == 100){
                    that.mSeconds = 0;
                    that.seconds++;
                }
                that.refreshTimer();
                if(that.seconds > that.limitSeconds){
                    that.startCountdown(false);
                }
            },100);
        }else{
            clearInterval(this.int);
            this.restartTimer();
            this.refreshTimer();
            this.int = null;
        }
    };

    p.checkBonusFeature = function () {
        var hasBonus = this.timerIsRunning;
        return hasBonus;
    };

    system.Timer = createjs.promote(Timer,"Container");

})();