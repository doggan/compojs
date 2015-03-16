/* global PIXI */
'use strict';

module.exports = function(param) {
    var renderer = param.renderer;
    var stage = new PIXI.Stage(param.clearColor);




    var getWindowSize = function() {
        return {
            width: renderer.width,
            height: renderer.height
        };
    };

    var update = function() {
        renderer.render(stage);
    };

    return {
        addToStage: function(obj) {
            stage.addChild(obj);
        },
        removeFromStage: function(obj) {
            stage.removeChild(obj);
        },
        setMouseDownCallback: function(cb) {
            stage.mousedown = cb;
        },

        getWindowSize: getWindowSize,

        update: update
    };
};
