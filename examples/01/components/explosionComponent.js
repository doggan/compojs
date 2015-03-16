/* global PIXI */
'use strict';

var SCALE_RATE = 300.0;
var LIFETIME = 0.15;
var ROTATION_RATE = 500 * Math.PI / 180;

var COLORS = [
    0xFFFF00,
    0xff004d,
    0x00cfd0,
    0x2ecc71,
    0x29FF32,
    0xFF5507
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = function() {
    var activeExplosions = [];
    var rendererSystem;

    var start = function() {
        rendererSystem = this.entity.engine.findEntity('system').getComponent('RendererComponent');
    };

    var update = function() {
        var dt = this.entity.engine.time.deltaTime;

        for (var i = 0; i < activeExplosions.length; /*i++*/ ) {
            var explosion = activeExplosions[i];
            var newScale = explosion.display.scale.x + SCALE_RATE * dt;
            explosion.display.scale.x = newScale;
            explosion.display.scale.y = newScale;

            // Pruning.
            if (explosion.elapsedTime >= LIFETIME) {
                activeExplosions.splice(i, 1);
                rendererSystem.removeFromStage(explosion.display);
                continue;
            }

            explosion.display.rotation += ROTATION_RATE * dt;
            explosion.elapsedTime += dt;
            i++;
        }
    };

    var doExplosion = function(x, y, size) {
        var spokes = 8;
        var holeSize = 0.15;
        var lineWidth = 0.06;
        var deltaAngle = 2 * Math.PI / spokes;
        var graphics = new PIXI.Graphics();

        var color = COLORS[getRandomInt(0, COLORS.length)];
        for (var i = 0; i < spokes; i++) {
            graphics.lineStyle(lineWidth, color, 0.75);

            var angle = i * deltaAngle;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            graphics.moveTo(holeSize * cos, holeSize * sin);
            graphics.lineTo(cos, sin);
        }

        graphics.pivot.x = 0.5;
        graphics.pivot.y = 0.5;

        var display = new PIXI.DisplayObjectContainer();
        display.addChild(graphics);
        display.position.x = x;
        display.position.y = y;
        display.scale.x = size;
        display.scale.y = size;
        rendererSystem.addToStage(display);

        activeExplosions.push({
            display: display,
            elapsedTime: 0
        });
    };

    return {
        start: start,
        update: update,

        doExplosion: doExplosion
    };
};
