'use strict';

var EventEmitter = require('events').EventEmitter;
var foreach = require('lodash.foreach');

function Entity(inEngine, inName) {
    var name = inName || '';
    var engine = inEngine;
    var components = [];
    var componentNames = [];
    var updateableComponents = [];
    var eventEmitter = new EventEmitter();

    var didCallStart = false;

    var start = function() {
        foreach(components, function(component) {
            if (typeof component.start === 'function') {
                component.start();
            }
        });

        didCallStart = true;
    };

    /**
     * Destroy entity and all attached components.
     */
    var destroy = function() {
        eventEmitter.removeAllListeners();
        engine.destroyEntity(this);
    };

    var update = function() {
        // Trigger 'start' on first update.
        if (!didCallStart) {
            start();
        }

        foreach(updateableComponents, function(component) {
            component.update();
        });
    };

    /**
     * Add a component to this entity.
     */
    var addComponent = function(componentName, componentParam) {
        var component = engine.createComponent(componentName, componentParam);
        if (component) {
            component.entity = this;
            components.push(component);
            componentNames.push(componentName);
            if (typeof component.update === 'function') {
                updateableComponents.push(component);
            }
        }
        return this;
    };

    /**
     * Gets a component by name.
     */
    var getComponent = function(componentName) {
        for (var i = 0; i < componentNames.length; i++) {
            if (componentNames[i] === componentName) {
                return components[i];
            }
        }
        return null;
    };

    /**
     * Send a signal to the entity which can be handled by a component
     * of this entity.
     */
    var sendSignal = function(signalType) {
        switch (arguments.length) {
            case 1:
                eventEmitter.emit(signalType);
                break;
            case 2:
                eventEmitter.emit(signalType, arguments[1]);
                break;
            case 3:
                eventEmitter.emit(signalType, arguments[1], arguments[2]);
                break;
            default:
                // Slowest case - for multiple arguments.
                var len = arguments.length;
                var args = new Array(len - 1);
                for (var i = 1; i < len; i++) {
                    args[i - 1] = arguments[i];
                }
                eventEmitter.emit(signalType, args);
        }
    };

    /**
     * Add a listener to handle the given signal type.
     */
    var addSignalListener = function(signalType, listener) {
        eventEmitter.addListener(signalType, listener);
    };

    /**
     * Remove a listener from handling the given signal type.
     */
    var removeSignalListener = function(signalType, listener) {
        eventEmitter.removeListener(signalType, listener);
    };

    return {
        name: name,
        engine: engine,

        destroy: destroy,
        update: update,

        addComponent: addComponent,
        getComponent: getComponent,

        sendSignal: sendSignal,
        addSignalListener: addSignalListener,
        removeSignalListener: removeSignalListener
    };
}

module.exports = function(engine, name) {
    return new Entity(engine, name);
};
