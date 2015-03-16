/* global PIXI */
'use strict';

var MIN_X = 20;
var MAX_X = 400 - MIN_X;
var MIN_Y = 30;
var MAX_Y = 290;

module.exports = function() {
    var graphics;

    var start = function() {
        var rendererSystem = this.entity.engine.findEntity('system').getComponent('RendererComponent');

        var windowSize = rendererSystem.getWindowSize();

        graphics = new PIXI.Graphics();

        graphics.beginFill(0xEE6352);
        graphics.lineStyle(2, 0x3FA7D6, 1);
        graphics.drawPolygon([-10, 0, 10, 0, 0, -20]);

        graphics.position.x = windowSize.width * 0.5;
        graphics.position.y = MAX_Y;

        rendererSystem.addToStage(graphics);
    };

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

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

        getPosition: function() {
            return {
                x: graphics.position.x,
                y: graphics.position.y
            };
        },
        move: move
    };
};
