/* global window */
'use strict';

window.Example1_startEngine = function(renderer) {
    var componentEngine = require('./../../index');

    // Register components.
    var engine = componentEngine.createEngine()
        // System components.
        .registerComponent('RendererComponent', require('./components/rendererComponent'))
        // Player components.
        .registerComponent('PlayerBodyComponent', require('./components/playerBodyComponent'))
        .registerComponent('PlayerInputComponent', require('./components/playerInputComponent'))
        .registerComponent('PlayerActionComponent', require('./components/playerActionComponent'))
        // Asteroid components.
        .registerComponent('AsteroidComponent', require('./components/asteroidComponent'));

    engine.createEntity()
        .addComponent('AsteroidComponent');

    engine.createEntity()
        .addComponent('PlayerBodyComponent')
        .addComponent('PlayerInputComponent')
        .addComponent('PlayerActionComponent');

    engine.createEntity('system')
        .addComponent('RendererComponent', {
            renderer: renderer,
            clearColor: 0xFFFFFF
        });

    engine.run();

    return engine;
};
