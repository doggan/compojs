/* global window */
'use strict';

window.Example1_startEngine = function(renderer) {
    var componentEngine = require('./../../index');

    // Register components.
    var engine = componentEngine.createEngine()
        // System components.
        .registerComponent('RendererComponent', require('./components/rendererComponent'))
        .registerComponent('AsteroidComponent', require('./components/asteroidComponent'))
        .registerComponent('ExplosionComponent', require('./components/explosionComponent'))
        // Player components.
        .registerComponent('PlayerBodyComponent', require('./components/playerBodyComponent'))
        .registerComponent('PlayerInputComponent', require('./components/playerInputComponent'))
        .registerComponent('PlayerActionComponent', require('./components/playerActionComponent'))
        // Bullet components.
        .registerComponent('BulletComponent', require('./components/bulletComponent'));

    engine.createEntity()
        .addComponent('PlayerBodyComponent')
        .addComponent('PlayerActionComponent')
        .addComponent('PlayerInputComponent');

    engine.createEntity('system')
        .addComponent('AsteroidComponent')
        .addComponent('ExplosionComponent')
        .addComponent('RendererComponent', {
            renderer: renderer,
            clearColor: 0xFFFFFF
        });

    engine.run();

    return engine;
};
