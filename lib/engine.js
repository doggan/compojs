/* global window */
'use strict';

var foreach = require('lodash.foreach');

function Engine(settings) {
    settings = settings || {};
    settings.targetFps = typeof settings.targetFps !== 'undefined' ? settings.targetFps : 60;

    console.log('Creating CompoJS::engine with settings: ' + JSON.stringify(settings, null, 2));

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

        // Schedule ticks at the target fps.
        setTimeout(function() {
            loopFunc(run);
        }, 1000 / settings.targetFps);
    };

    var componentFactory = [];
    var componentsToCreate = [];

    var componentBucketIndices = [];
    var componentInitializationBuckets = [];
    var componentUpdateBuckets = [];

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
                    // Destroy all components belonging to this entity.
                    for (var j = 0; j < entity._components.length; j++) {
                        destroyComponent(entity._componentNames[j], entity._components[j]);
                    }
                    entity._components.length = 0;
                    entity._componentNames.length = 0;

                    entities.splice(i, 1);
                    break;
                }
            }
        });
        entitiesToDestroy = [];

        // Handle queued component creation.
        // We delay the bucket insertion of components to prevent issue when
        // one entity creates another entity in its update method. If we don't delay
        // the execution, the newly created component will be updated immediately
        // and its initialization will not have executed.
        foreach(componentsToCreate, function(componentInfo) {
            var bucketIndex = componentBucketIndices[componentInfo.componentName];

            // Add ALL components to the initialization list.
            componentInitializationBuckets[bucketIndex].push(componentInfo.component);

            // Add updateable components to correct list.
            if (typeof componentInfo.component.update === 'function') {
                componentUpdateBuckets[bucketIndex].push(componentInfo.component);
            }
        });
        componentsToCreate = [];

        // Initialize all components added this frame.
        foreach(componentInitializationBuckets, function(bucket) {
            foreach(bucket, function(component) {
                if (typeof component.start === 'function') {
                    component.start();
                }
            });

            // Clear out all entries (initialization only needs to be run once).
            bucket.length = 0;
        });

        // Update all components in order.
        foreach(componentUpdateBuckets, function(bucket) {
            foreach(bucket, function(component) {
                component.update();
            });
        });

        time.frameCount += 1;
        prevTime = now;
    };

    /**
     * Registers a component. All components must be registered
     * before they can be used.
     */
    var registerComponent = function(componentName, componentCreator) {
        if (!componentFactory.hasOwnProperty(componentName)) {
            componentFactory[componentName] = componentCreator;

            // Allocate a bucket index for this component type.
            // Component registration order dictates update and initialization order.
            var bucketIndex = componentInitializationBuckets.length;
            componentBucketIndices[componentName] = bucketIndex;
            componentInitializationBuckets.push([]);
            componentUpdateBuckets.push([]);
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

        var component = componentFactory[componentName](componentParam);

        if (component) {
            // We QUEUE the creation of components to prevent issues when entities
            // are dynamically created in the start/update methods of other entities.
            componentsToCreate.push({
                componentName: componentName,
                component: component
            });
        }

        return component;
    };

    var destroyComponent = function(componentName, component) {
        var bucketIndex = componentBucketIndices[componentName];
        var i, components;

        // Remove from initialization list.
        components = componentInitializationBuckets[bucketIndex];
        for (i = 0; i < components.length; i++) {
            if (components[i] === component) {
                components.splice(i, 1);
                break;
            }
        }
        // Remove from update list.
        components = componentUpdateBuckets[bucketIndex];
        for (i = 0; i < components.length; i++) {
            if (components[i] === component) {
                components.splice(i, 1);
                break;
            }
        }
        // Remove from 'queued' component creation list.
        for (i = 0; i < componentsToCreate.length; i++) {
            if (componentsToCreate[i].component === component) {
                componentsToCreate.splice(i, 1);
                break;
            }
        }
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
        _createComponent: createComponent,

        createEntity: createEntity,
        _destroyEntity: destroyEntity,
        findEntity: findEntity
    };
}

module.exports = function(settings) {
    return new Engine(settings);
};
