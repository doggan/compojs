/* global PIXI */
'use strict';

module.exports = function(param) {
    var self = {};
    var renderer = param.renderer;
    var stage = new PIXI.Stage(param.clearColor);

    var rootObject = new PIXI.DisplayObjectContainer();
    stage.addChild(rootObject);

    self.getWindowSize = function() {
        return {
            width: renderer.width,
            height: renderer.height
        };
    };

    var shake = 0;
    var shakeDecay = 10.0;

    self.update = function() {
        var dt = self.entity.engine.time.deltaTime;

        // 'Camera' shake.
        if (shake > 0) {
            var x = Math.cos(Math.random());
            var y = Math.sin(Math.random());

            rootObject.position.x = x * shake;
            rootObject.position.y = y * shake;

            shake -= shakeDecay * dt;
        }

        renderer.render(stage);
    };

    self.addToStage = function(obj) {
        rootObject.addChild(obj);
    };

    self.removeFromStage = function(obj) {
        rootObject.removeChild(obj);
    };

    self.doCameraShake = function(amount) {
        shake = amount;
    };

    return self;
};
