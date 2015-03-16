/* global document */
'use strict';

module.exports = function() {
    var leftKeyDown = false;
    var rightKeyDown = false;
    var forwardKeyDown = false;
    var backwardKeyDown = false;

    var start = function() {
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
    };

    return {
        start: start,

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
        }
    };
};
