/* global window, PIXI */
'use strict';

window.Example0_startEngine = function(renderer) {
    var componentEngine = require('./../../index');

    var stage = new PIXI.Stage(0x2980b9);

    // Register components.
    var engine = componentEngine.createEngine()
        .registerComponent('RenderComponent', function() {
            var self = {};

            self.update = function() {
                renderer.render(stage);
            };

            return self;
        })
        .registerComponent('SpinningShapeComponent', function(param) {
            var self = {};

            var colors = [0x00FFFF, 0xFF0000, 0x00FF00, 0x0000FF];
            var colorIndex = 0;

            var square = new PIXI.Graphics();
            var container = new PIXI.DisplayObjectContainer();
            container.addChild(square);
            container.position.x = param.startX;
            container.position.y = param.startY;
            stage.addChild(container);

            var rebuildSquare = function() {
                square.clear();
                square.beginFill(colors[colorIndex]);
                square.lineStyle(2, 0xFFFFFF);
                square.drawRect(0, 0, 50, 50);
                square.pivot.x = 25;
                square.pivot.y = 25;
            };

            rebuildSquare();

            var elapsedTime = 0;
            self.update = function() {
                var dt = self.entity.engine.time.deltaTime;

                // Random color changes.
                if (elapsedTime > 1.0) {
                    colorIndex += 1;
                    if (colorIndex >= colors.length) {
                        colorIndex = 0;
                    }

                    rebuildSquare();
                    elapsedTime = 0;
                } else {
                    elapsedTime += dt;
                }

                // Rotation.
                square.rotation += 1.5 * dt;
            };

            return self;
        });

    // Create our renderer.
    engine.createEntity()
        .addComponent('RenderComponent');

    // Create some entities.
    var entityPositions = [
        [100, 100],
        [300, 100],
        [100, 200],
        [300, 200],
        [200, 150]
    ];
    for (var i = 0; i < entityPositions.length; i++) {
        engine.createEntity()
            .addComponent('SpinningShapeComponent', {
                startX: entityPositions[i][0],
                startY: entityPositions[i][1]
            });
    }

    // Go!
    engine.run();

    return engine;
};
