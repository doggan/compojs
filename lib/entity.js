'use strict';

var EventEmitter = require('events').EventEmitter;

function Entity(inEngine, inName) {
    var name = inName || '';
    var engine = inEngine;
    var components = [];
    var componentNames = [];
    var eventEmitter = new EventEmitter();

    /**
     * Destroy entity and all attached components.
     */
    var destroy = function() {
        eventEmitter.removeAllListeners();

        engine._destroyEntity(this);
    };

    /**
     * Add a component to this entity.
     */
    var addComponent = function(componentName, componentParam) {
        var component = engine._createComponent(componentName, componentParam);
        if (component) {
            component.entity = this;
            components.push(component);
            componentNames.push(componentName);
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

        _components: components,
        _componentNames: componentNames,
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
