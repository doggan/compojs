var expect = require('chai').expect,
    Engine = require('../index').Engine,
    Entity = require('../index').Entity,
    Component = require('../index').Component,
    inherits = require('inherits');

describe('Engine', function() {
    it('should run and emit update events', function(done) {
        var engine = new Engine();

        var expectedFrameCount;
        var updateCount = 0;
        var lateUpdateCount = 0;

        engine.on('update', function() {
            expect(engine.time.frameCount).to.equal(expectedFrameCount);
            updateCount++;
        });
        engine.on('lateUpdate', function() {
            expect(engine.time.frameCount).to.equal(expectedFrameCount);
            lateUpdateCount++;
        });

        expectedFrameCount = 0;
        engine.tick();
        expect(updateCount).to.equal(1);
        expect(lateUpdateCount).to.equal(1);

        expectedFrameCount = 1;
        engine.tick();
        expect(updateCount).to.equal(2);
        expect(lateUpdateCount).to.equal(2);

        done();
    });
});

describe('Entity', function() {
    var engine = new Engine();

    it('should be able to add and get components', function(done) {
        var entity = new Entity(engine);

        expect(entity.getComponent('InvalidComponent')).to.not.exist;

        function FooComponent(entity) {
            Component.call(this, entity);
        }
        inherits(FooComponent, Component);

        function BarComponent(entity) {
            Component.call(this, entity);
        }
        inherits(BarComponent, Component);

        var fooComponent = new FooComponent(entity);
        var barComponent = new BarComponent(entity);
        entity.addComponent(fooComponent);
        entity.addComponent(barComponent);

        expect(entity.getComponent('InvalidComponent')).to.not.exist;
        expect(entity.getComponent('FooComponent')).to.equal(fooComponent);
        expect(entity.getComponent('BarComponent')).to.equal(barComponent);

        done();
    });

    it('should be able to send and receive')
});
