/* global window */
'use strict';

var foreach = require('lodash.foreach');

function Engine() {
    var prevTime = Date.now() / 1000;

    var time = {
        // The time in seconds it took to complete the last frame.
        deltaTime: 0,
        // The total number of frames that have passed.
        frameCount: 0
    };

    // Use requestAnimationFrame if we're running in the browser,
    // else use a fallback implementation (for running in tests).
    var loopFunc = (typeof window !== 'undefined') ?
        window.requestAnimationFrame :
        function() {
            var prev = new Date().getTime();
            return function(fn) {
                var curr = new Date().getTime();
                var ms = Math.max(0, 16 - (curr - prev));
                var req = setTimeout(fn, ms);
                prev = curr;
                return req;
            };
        }();

    /**
     * Start the engine loop.
     */
    var run = function() {
        tick();

        loopFunc(run);
    };

    /**
     * Perform a single tick of engine execution.
     * Useful for tests. Usually, Engine.run() is preferred.
     * Do not call if Engine.run() has already been called.
     */
    var tick = function() {
        var now = Date.now() / 1000;
        time.deltaTime = now - prevTime;

        // Destroy entities.
        // Entity destruction is queued and processed here
        // to prevent issues when entities destroy themselves in their
        // update method.
        // We handle destruction of entities BEFORE update to prevent
        // queued destroyed entities from being updated 1 extra time.
        foreach(entitiesToDestroy, function(entity) {
            for (var i = 0; i < entities.length; i++) {
                if (entities[i] === entity) {
                    entities.splice(i, 1);
                    break;
                }
            }
        });
        entitiesToDestroy = [];

        // Update all entities.
        foreach(entities, function(entity) {
            entity.update();
        });

        time.frameCount += 1;
        prevTime = now;
    };

    var componentFactory = [];

    /**
     * Registers a component. All components must be registered
     * before they can be used.
     */
    var registerComponent = function(componentName, componentCreator) {
        if (!componentFactory.hasOwnProperty(componentName)) {
            componentFactory[componentName] = componentCreator;
        } else {
            console.warn('Component already registered: ' + componentName);
        }
        return this;
    };

    var createComponent = function(componentName, componentParam) {
        if (!componentFactory.hasOwnProperty(componentName)) {
            console.warn('Component not registered: ' + componentName);
            return null;
        }

        return componentFactory[componentName](componentParam);
    };

    var entities = [];
    var entitiesToDestroy = [];

    /**
     * Creates an empty entity.
     */
    var createEntity = function(name) {
        var entity = require('./entity')(this, name);
        entities.push(entity);
        return entity;
    };

    var destroyEntity = function(entity) {
        for (var i = 0; i < entities.length; i++) {
            if (entities[i] === entity) {
                entitiesToDestroy.push(entity);
                return;
            }
        }
    };

    /**
     * Find an entity by name.
     */
    var findEntity = function(entityName) {
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].name === entityName) {
                return entities[i];
            }
        }
        return null;
    };

    return {
        time: time,
        tick: tick,
        run: run,

        registerComponent: registerComponent,
        createComponent: createComponent,

        createEntity: createEntity,
        destroyEntity: destroyEntity,
        findEntity: findEntity
    };
}

module.exports = function() {
    return new Engine();
};
