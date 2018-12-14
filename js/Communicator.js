/**
 * Created by Conan on 13.11.2016..
 */

this.system = this.system || {};

(function(){
    "use strict";

    var Communicator = function(game){
        this.initializeCommunicator(game);
    };

    var p = Communicator.prototype;
    p.game = null;


    p.initializeCommunicator = function(game) {
        console.log("Communicator initiallize");
        this.game = game;
    };

    p.insertResults = function(data){
        $.ajax
        ({
            type: "GET",
            dataType : 'json',
            async: true,
            url: 'comm.php',
            data: { data: JSON.stringify(data) },
            success: function () {alert("Thanks!"); },
            failure: function() {alert("Error!");}
        });
    };

    p.getResults = function(callback){
        var response;
        var that = this;

        $.ajax({
           type:"GET",
            async: true,
            url:"scores.json",
            success:function(data){
                response = data;
                callback(data);
            }
        });
    };
    
    system.Communicator = Communicator;

})();