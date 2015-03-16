'use strict';

var MOVE_SPEED = 200;

module.exports = function() {
    var bodyComponent;
    var inputComponent;

    var start = function() {
        // Cache frequently used components.
        bodyComponent = this.entity.getComponent('PlayerBodyComponent');
        inputComponent = this.entity.getComponent('PlayerInputComponent');
    };

    var update = function() {
        var dx = 0;
        var dy = 0;
        var dt = this.entity.engine.time.deltaTime;
        if (inputComponent.isLeftDown()) {
            dx = -MOVE_SPEED;
        }
        if (inputComponent.isRightDown()) {
            dx = MOVE_SPEED;
        }
        if (inputComponent.isForwardKeyDown()) {
            dy = -MOVE_SPEED;
        }
        if (inputComponent.isBackwardKeyDown()) {
            dy = MOVE_SPEED;
        }

        // Clamp diagonal speed.
        var speed = dx * dx + dy * dy;
        if (speed > (MOVE_SPEED * MOVE_SPEED)) {
            speed = Math.sqrt(speed);
            dx = dx / speed * MOVE_SPEED;
            dy = dy / speed * MOVE_SPEED;
        }

        // Update position.
        bodyComponent.move(dx * dt, dy * dt);
    };

    return {
        start: start,
        update: update
    };
};
