/* global PIXI */
'use strict';

module.exports = function(param) {
    var renderer = param.renderer;
    var stage = new PIXI.Stage(param.clearColor);

    var rootObject = new PIXI.DisplayObjectContainer();
    stage.addChild(rootObject);

    var getWindowSize = function() {
        return {
            width: renderer.width,
            height: renderer.height
        };
    };

    var shake = 0;
    var shakeDecay = 10.0;

    var update = function() {
        var dt = this.entity.engine.time.deltaTime;

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

    return {
        addToStage: function(obj) {
            rootObject.addChild(obj);
        },
        removeFromStage: function(obj) {
            rootObject.removeChild(obj);
        },
        setMouseDownCallback: function(cb) {
            stage.mousedown = cb;
        },

        doCameraShake: function(amount) {
            shake = amount;
        },

        getWindowSize: getWindowSize,

        update: update
    };
};
