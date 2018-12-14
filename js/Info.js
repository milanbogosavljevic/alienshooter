
this.system = this.system || {};
(function(){
    "use strict";

    var Info = function(){
        this.Container_constructor();
        this.initializeInfo();
    };

    var p = createjs.extend(Info,createjs.Container);

    p.background = null;

    p.initializeInfo = function() {
        console.log("Info initialize");
        this.background = system.Assets.getImage("info");
        this.addChild(this.background);
    };

    //system.Info = Info;
    system.Info = createjs.promote(Info,"Container");

})();