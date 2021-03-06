/* global PIXI */
'use strict';

var foreach = require('lodash.foreach');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

var COLORS = [
    [0x380036, 0x0CBABA],
    [0xD5573B, 0x004489],
    [0x2F0A28, 0xC94277],
    [0xFF3C38, 0xFFF275],
    [0x17B2B0, 0x9000B3],
    [0x160F29, 0x3D9943]
];

module.exports = function() {
    var self = {};
    var asteroids = [];
    var spawnXRange;
    var rendererSystem;

    function createAsteroidShape(radius) {
        var color = COLORS[getRandomInt(0, COLORS.length)];
        var shapeCreators = [
            function() {
                var graphics = new PIXI.Graphics();

                graphics.lineStyle(2, color[0], 1);
                graphics.beginFill(color[1], 1);
                graphics.drawCircle(0, 0, radius);

                return graphics;
            },
            function() {
                var graphics = new PIXI.Graphics();

                var width = 1 * radius;
                var height = 1 * radius;

                graphics.lineStyle(2, color[0], 1);
                graphics.beginFill(color[1], 1);
                graphics.drawRect(0, 0, width, height);

                graphics.pivot.x = width * 0.5;
                graphics.pivot.y = height * 0.5;

                return graphics;
            },
            function() {
                var graphics = new PIXI.Graphics();

                var width = 1 * radius;
                var height = 1 * radius;

                graphics.lineStyle(2, color[0], 1);
                graphics.beginFill(color[1], 1);
                graphics.drawRoundedRect(0, 0, width, height, 4);

                graphics.pivot.x = width * 0.5;
                graphics.pivot.y = height * 0.5;

                return graphics;
            },
            function() {
                var graphics = new PIXI.Graphics();

                graphics.lineStyle(2, color[0], 1);
                graphics.beginFill(color[1], 1);

                // Hexagon.
                var points = [-1, 0, -0.5, 0.85, 0.5, 0.85, 1, 0, 0.5, -0.85, -0.5, -0.85];
                for (var i = 0; i < points.length; i++) {
                    points[i] *= radius;
                }

                graphics.drawPolygon(points);

                return graphics;
            }
        ];

        return shapeCreators[getRandomInt(0, shapeCreators.length)]();
    }

    function createAsteroid() {
        var radius = getRandomInt(10, 25);

        var display = new PIXI.DisplayObjectContainer();
        display.addChild(createAsteroidShape(radius));
        display.position.x = getRandomArbitrary(spawnXRange[0], spawnXRange[1]);
        display.position.y = -radius;
        rendererSystem.addToStage(display);

        var movementRate = getRandomArbitrary(25, 75);

        var rotationRate = getRandomArbitrary(degToRad(20), degToRad(180));
        if (getRandomInt(0, 2) === 0) {
            rotationRate = -rotationRate;
        }

        return {
            display: display,
            radius: radius,
            elapsedTime: 0,
            movementRate: movementRate,
            startXPosition: display.position.x,
            horizontalAmplitude: getRandomInt(5, 30),
            rotationRate: rotationRate
        };
    }

    self.start = function() {
        rendererSystem = self.entity.engine.findEntity('system').getComponent('RendererComponent');
        spawnXRange = [0, rendererSystem.getWindowSize().width];
    };

    var destroyAsteroid = function(asteroidIndex) {
        var asteroid = asteroids[asteroidIndex];
        rendererSystem.removeFromStage(asteroid.display);
        asteroids.splice(asteroidIndex, 1);
    };

    var asteroidSpawnInterval = 0.2;
    var elapsedTimeSinceLastSpawn = 0;

    self.update = function() {
        var dt = self.entity.engine.time.deltaTime;
        var windowSize = rendererSystem.getWindowSize();

        if (elapsedTimeSinceLastSpawn > asteroidSpawnInterval) {
            asteroids.push(createAsteroid());
            elapsedTimeSinceLastSpawn = 0;
        } else {
            elapsedTimeSinceLastSpawn += dt;
        }

        // Movement.
        for (var i = 0; i < asteroids.length; /*i++*/ ) {
            var asteroid = asteroids[i];

            var newY = asteroid.display.position.y + asteroid.movementRate * dt;

            // Prune when below bottom of screen.
            if (newY > (windowSize.height + asteroid.radius)) {
                destroyAsteroid(i);
                continue;
            }

            asteroid.display.position.x = asteroid.startXPosition + Math.sin(asteroid.elapsedTime) * asteroid.horizontalAmplitude;
            asteroid.display.position.y = newY;

            asteroid.elapsedTime += dt;

            i++;
        }

        // Rotation.
        foreach(asteroids, function(asteroid) {
            asteroid.display.rotation += asteroid.rotationRate * dt;
        });
    };

    /**
     * Check collision with the asteroids and the given x/y position.
     * Returns true if there is a collision, and destroys the asteroid.
     */
    self.checkCollision = function(x, y) {
        for (var i = 0; i < asteroids.length; i++) {
            var asteroid = asteroids[i];
            var asteroidPos = asteroid.display.position;
            var deltaX = (asteroidPos.x - x);
            var deltaY = (asteroidPos.y - y);
            var distSqr = deltaX * deltaX + deltaY * deltaY;
            var radSqr = asteroid.radius * asteroid.radius;
            if (distSqr < radSqr) {
                destroyAsteroid(i);

                var explosionSystem = self.entity.engine.findEntity('system').getComponent('ExplosionComponent');
                explosionSystem.doExplosion(asteroidPos.x, asteroidPos.y, asteroid.radius * getRandomArbitrary(0.5, 2));
                rendererSystem.doCameraShake(15 * getRandomArbitrary(0.5, 1));

                return true;
            }
        }

        return false;
    };

    return self;
};
