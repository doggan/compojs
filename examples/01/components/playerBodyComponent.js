/* global PIXI */
'use strict';

var MIN_X = 10;
var MAX_X = 400 - MIN_X;
var MIN_Y = 20;
var MAX_Y = 295;

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

module.exports = function() {
    var graphics;

    var start = function() {
        var rendererSystem = this.entity.engine.findEntity('system').getComponent('RendererComponent');

        var windowSize = rendererSystem.getWindowSize();

        graphics = new PIXI.Graphics();

        graphics.beginFill(0xF72C25);
        graphics.lineStyle(1, 0x071013, 1);
        graphics.drawPolygon([-6, 0, 6, 0, 0, -14]);

        graphics.position.x = windowSize.width * 0.5;
        graphics.position.y = MAX_Y;

        rendererSystem.addToStage(graphics);
    };

    var fromScale = 1.0;
    var toScale = 1.25;
    var elapsedScaleTime = 0;
    var totalScaleTime = 0.25;
    var update = function() {
        var dt = this.entity.engine.time.deltaTime;

        // Scale animation.
        var scale;
        var t = elapsedScaleTime / totalScaleTime;
        if (t >= 1.0) {
            t = 1.0;
            scale = toScale;
            elapsedScaleTime = 0;

            var tmp = fromScale;
            fromScale = toScale;
            toScale = tmp;
        } else {
            elapsedScaleTime += dt;
            scale = ((1.0 - t) * fromScale) + (t * toScale);
        }

        graphics.scale.x = scale;
        graphics.scale.y = scale;
    };

    var move = function(x, y) {
        var newX = graphics.position.x + x;
        var newY = graphics.position.y + y;

        newX = clamp(newX, MIN_X, MAX_X);
        newY = clamp(newY, MIN_Y, MAX_Y);

        graphics.position.x = newX;
        graphics.position.y = newY;
    };

    return {
        start: start,
        update: update,

        getPosition: function() {
            return {
                x: graphics.position.x,
                y: graphics.position.y
            };
        },
        move: move
    };
};
