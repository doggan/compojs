/* global document */
'use strict';

module.exports = function() {
    var self = {};
    var leftKeyDown = false;
    var rightKeyDown = false;
    var forwardKeyDown = false;
    var backwardKeyDown = false;
    var isMouseButtonDown = false;

    self.start = function() {
        // Keyboard events.
        document.addEventListener('keydown', function(event) {
            switch (event.keyCode) {
                case 37:
                case 65:
                    leftKeyDown = true;
                    break;
                case 39:
                case 68:
                    rightKeyDown = true;
                    break;
                case 38:
                case 87:
                    forwardKeyDown = true;
                    break;
                case 40:
                case 83:
                    backwardKeyDown = true;
                    break;
            }
        }, false);
        document.addEventListener('keyup', function(event) {
            switch (event.keyCode) {
                case 37:
                case 65:
                    leftKeyDown = false;
                    break;
                case 39:
                case 68:
                    rightKeyDown = false;
                    break;
                case 38:
                case 87:
                    forwardKeyDown = false;
                    break;
                case 40:
                case 83:
                    backwardKeyDown = false;
                    break;
            }
        }, false);

        // Mouse events.
        var rendererSystem = self.entity.engine.findEntity('system').getComponent('RendererComponent');
        rendererSystem.setMouseDownCallback(function(data) {
            isMouseButtonDown = true;
        });
    };

    self.update = function() {
        isMouseButtonDown = false;
    };

    self.isLeftDown = function() {
        return leftKeyDown;
    };
    self.isRightDown = function() {
        return rightKeyDown;
    };
    self.isForwardKeyDown = function() {
        return forwardKeyDown;
    };
    self.isBackwardKeyDown = function() {
        return backwardKeyDown;
    };
    self.isMouseDown = function() {
        return isMouseButtonDown;
    };

    return self;
};
