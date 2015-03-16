/* global window, PIXI */
'use strict';

window.Example0_startEngine = function(renderer) {
    var componentEngine = require('./../../index');

    // Register components.
    var engine = componentEngine.createEngine()
        .registerComponent('DefaultComponent', function() {
            var $compo = {};

            var stage = new PIXI.Stage(0x2980b9);

            var colors = [0x00FFFF, 0xFF0000, 0x00FF00, 0x0000FF];
            var colorIndex = 0;

            var rebuildSquare = function() {
                square.clear();
                square.beginFill(colors[colorIndex]);
                square.lineStyle(2, 0xFFFFFF);
                square.drawRect(0, 0, 50, 50);
                square.pivot.x = 25;
                square.pivot.y = 25;
            };

            var square = new PIXI.Graphics();
            var container = new PIXI.DisplayObjectContainer();
            container.addChild(square);
            container.position.x = 200;
            container.position.y = 150;
            stage.addChild(container);

            rebuildSquare();

            var elapsedTime = 0;
            $compo.update = function() {
                var dt = $compo.entity.engine.time.deltaTime;

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

                renderer.render(stage);
            };

            return $compo;
        });

    // Create entity.
    engine.createEntity()
        .addComponent('DefaultComponent');

    // Go!
    engine.run();

    return engine;
};
