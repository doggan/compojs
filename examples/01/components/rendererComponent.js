/* global PIXI */
'use strict';

module.exports = function(param) {
    var renderer = param.renderer;
    var stage = new PIXI.Stage(param.clearColor);

    var addToStage = function(obj) {
        stage.addChild(obj);
    };

    var removeFromStage = function(obj) {
        stage.removeChild(obj);
    };

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
        addToStage: addToStage,
        removeFromStage: removeFromStage,

        getWindowSize: getWindowSize,

        update: update
    };
};
