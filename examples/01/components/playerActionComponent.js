'use strict';

var MOVE_SPEED = 200;

module.exports = function() {
    var self = {};
    var bodyComponent;
    var inputComponent;

    self.start = function() {
        // Cache frequently used components.
        bodyComponent = self.entity.getComponent('PlayerBodyComponent');
        inputComponent = self.entity.getComponent('PlayerInputComponent');
    };

    var fireInterval = 0.1;
    var elapsedTimeSinceFire = 0;

    self.update = function() {
        var dx = 0;
        var dy = 0;
        var dt = self.entity.engine.time.deltaTime;
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

        // Shots fired! Create a bullet entity.
        if (elapsedTimeSinceFire > fireInterval) {
            if (inputComponent.isFireKeyDown()) {
                var currentPos = bodyComponent.getPosition();
                self.entity.engine.createEntity()
                    .addComponent('BulletComponent', {
                        startX: currentPos.x,
                        startY: currentPos.y - 25
                    });

                elapsedTimeSinceFire = 0;

            }
        } else {
            elapsedTimeSinceFire += dt;
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

    return self;
};
