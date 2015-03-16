'use strict';
/* global PIXI */

var MOVE_SPEED = 120;
var SIZE = 2;

module.exports = function(param) {
    var asteroidSystem;
    var rendererSystem;
    var graphics;
    var self;

    var start = function() {
        self = this;
        rendererSystem = this.entity.engine.findEntity('system').getComponent('RendererComponent');
        asteroidSystem = this.entity.engine.findEntity('system').getComponent('AsteroidComponent');

        graphics = new PIXI.Graphics();

        graphics.lineStyle(1, 0xFF6663, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawCircle(0, 0, SIZE);

        graphics.position.x = param.startX;
        graphics.position.y = param.startY;

        rendererSystem.addToStage(graphics);
    };

    var destroyBullet = function() {
        rendererSystem.removeFromStage(graphics);
        self.entity.destroy();
    };

    var update = function() {
        var dt = this.entity.engine.time.deltaTime;
        var newY = graphics.position.y - MOVE_SPEED * dt;

        // Prune.
        if (newY < (0 - SIZE)) {
            destroyBullet();
            return;
        }

        // Collision.
        if (asteroidSystem.checkCollision(graphics.position.x, newY)) {
            destroyBullet();
            return;
        }

        graphics.position.y = newY;
    };

    return {
        start: start,
        update: update
    };
};
