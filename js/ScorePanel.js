/**
 * Created by Conan on 14.11.2016..
 */

this.system = this.system || {};
(function(){
    "use strict";

    var ScorePanel = function(game,data){
        this.Container_constructor();
        this.initializeScorePanel(game,data);
    };

    var p = createjs.extend(ScorePanel,createjs.Container);

    p.game = null;

    p.initializeScorePanel = function(game,data) {
        console.log("ScorePanel init");
        this.game = game;
        var highscores = data.highscores;
        var shotsFired = data.totalFired;
        var totalHits = data.totalHits;
        var accuracy = data.accuracy;
        var score = data.score;
        this.setHighscores(highscores);
        this.playerStats(shotsFired,totalHits,accuracy,score);
    };
    
    p.setHighscores = function(highscores){
        var highscoreTxt = new createjs.Text("Highscores","46px Orbitron" , "white");
        highscoreTxt.textAlign = "left";
        highscoreTxt.textBaseline = "alphabetic";
        highscoreTxt.mouseEnabled = false;
        this.addChild(highscoreTxt);
        var count = 1;
        for(var i = highscores.length-1; i > -1; i--){
            var highscore = new createjs.Text(count + ". " + highscores[i].name +  " : " + highscores[i].score,"36px Orbitron" , "yellow");
            highscore.textAlign = "left";
            highscore.textBaseline = "alphabetic";
            highscore.mouseEnabled = false;
            highscore.y = 50 + (40 * count);
            this.addChild(highscore);
            count++;
        }
    };
    
    p.playerStats = function(shotsFired,totalHits,accuracy,score){
        var x = 730;
        var color = "#77beea";
        var totalFired = new createjs.Text("Total shots fired:"+shotsFired,"40px Orbitron" , color);
        totalFired.x = x;
        totalFired.y = 100;
        this.game.deepOptimize(totalFired);
        totalFired.textAlign = "center";
        totalFired.textBaseline = "alphabetic";

        var totalHits = new createjs.Text("Total hits:"+totalHits,"40px Orbitron" , color);
        totalHits.x = x;
        totalHits.y = 180;
        this.game.deepOptimize(totalHits);
        totalHits.textAlign = "center";
        totalHits.textBaseline = "alphabetic";

        var accuracy = new createjs.Text("Accuracy: "+accuracy+"%","40px Orbitron" , color);
        accuracy.x = x;
        accuracy.y = 260;
        this.game.deepOptimize(accuracy);
        accuracy.textAlign = "center";
        accuracy.textBaseline = "alphabetic";

        var score = new createjs.Text("Your score is:"+score,"60px Orbitron" , color);
        score.x = x;
        score.y = 20;
        this.game.deepOptimize(score);
        score.textAlign = "center";
        score.textBaseline = "alphabetic";

        this.addChild(totalFired,totalHits,accuracy,score);
    };
    
    p.clearAll = function(){
        this.removeAllChildren();
    };

    system.ScorePanel = createjs.promote(ScorePanel,"Container");

})();


