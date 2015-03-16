/* global document */
'use strict';

module.exports = function() {
    var leftKeyDown = false;
    var rightKeyDown = false;
    var forwardKeyDown = false;
    var backwardKeyDown = false;
    var isMouseButtonDown = false;

    var start = function() {
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
        var rendererSystem = this.entity.engine.findEntity('system').getComponent('RendererComponent');
        rendererSystem.setMouseDownCallback(function(data) {
            isMouseButtonDown = true;
        });
    };

    var update = function() {
        isMouseButtonDown = false;
    };

    return {
        start: start,
        update: update,

        isLeftDown: function() {
            return leftKeyDown;
        },
        isRightDown: function() {
            return rightKeyDown;
        },
        isForwardKeyDown: function() {
            return forwardKeyDown;
        },
        isBackwardKeyDown: function() {
            return backwardKeyDown;
        },
        isMouseDown: function() {
            return isMouseButtonDown;
        }
    };
};
