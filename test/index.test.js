/*jshint expr:true */

var expect = require('chai').expect,
    compo = require('../index');

describe('basic engine / entity / component functionality', function() {
    it('should add and get components', function(done) {
        var engine = compo.createEngine()
            .registerComponent('dummy1', function() {
                return {};
            })
            .registerComponent('dummy2', function() {
                return {};
            });

        var entity = engine.createEntity()
            .addComponent('dummy1')
            .addComponent('dummy2');

        expect(entity.getComponent('dummy1')).to.exist;
        expect(entity.getComponent('dummy2')).to.exist;
        expect(entity.getComponent('unknown')).to.not.exist;

        done();
    });

    it('should update all components', function(done) {
        var engine = compo.createEngine()
            .registerComponent('dummy_updateable', function() {
                return {
                    start: function() {
                        startCount++;
                    },
                    update: function() {
                        updateCount++;
                    }
                };
            });

        engine.createEntity()
            .addComponent('dummy_updateable');

        var startCount = 0;
        var updateCount = 0;

        expect(engine.time.frameCount).to.equal(0);
        expect(startCount).to.equal(0);
        expect(updateCount).to.equal(0);
        engine.tick();
        expect(engine.time.frameCount).to.equal(1);
        expect(startCount).to.equal(1);
        expect(updateCount).to.equal(1);
        engine.tick();
        expect(engine.time.frameCount).to.equal(2);
        expect(startCount).to.equal(1);
        expect(updateCount).to.equal(2);

        done();
    });

    it('should run the engine', function(done) {
        var engine = compo.createEngine();

        expect(engine.time.frameCount).to.equal(0);
        engine.run();

        setTimeout(function() {
            // Any # that's greater than 1 to verify that the loop is executing.
            var expectedMinFrameCount = 5;
            expect(engine.time.frameCount).to.be.at.least(expectedMinFrameCount);

            done();
        }, 200);
    });

    it('should destroy the entity', function(done) {
        var engine = compo.createEngine()
            .registerComponent('dummy_updateable', function() {
                return {
                    update: function() {
                        updateCount++;
                    }
                };
            });

        var entity = engine.createEntity()
            .addComponent('dummy_updateable');

        var updateCount = 0;

        expect(updateCount).to.equal(0);
        engine.tick();
        expect(updateCount).to.equal(1);

        entity.destroy();

        engine.tick();
        expect(updateCount).to.equal(1);

        done();
    });

    it('should send and receive signals', function(done) {
        var engine = compo.createEngine()
            .registerComponent('dummy1', function() {
                return {
                    onTestSignal: function(param) {
                        signalCount++;
                        expect(param).to.equal(paramVal);
                    }
                };
            });

        var entity = engine.createEntity()
            .addComponent('dummy1');
        var component = entity.getComponent('dummy1');

        var signalCount = 0;
        var paramVal = 1337;

        entity.sendSignal('test_event', paramVal);
        expect(signalCount).to.equal(0);

        entity.addSignalListener('test_event', component.onTestSignal);
        entity.sendSignal('test_event', paramVal);
        expect(signalCount).to.equal(1);

        entity.sendSignal('test_event', paramVal);
        expect(signalCount).to.equal(2);

        entity.removeSignalListener('test_event', component.onTestSignal);
        entity.sendSignal('test_event', paramVal);
        expect(signalCount).to.equal(2);

        entity.addSignalListener('test_event', component.onTestSignal);
        entity.sendSignal('test_event', paramVal);
        expect(signalCount).to.equal(3);

        entity.destroy();
        entity.sendSignal('test_event', paramVal);
        expect(signalCount).to.equal(3);

        done();
    });

    it('should find entities by name', function(done) {
        var engine = compo.createEngine();
        var entity = engine.createEntity('hoge');

        var hoge = engine.findEntity('hoge');
        expect(hoge).to.exist;
        expect(hoge).to.equal(entity);
        expect(hoge.name).to.equal('hoge');

        var unknown = engine.findEntity('unknown');
        expect(unknown).to.not.exist;

        done();
    });

    it('should update components in the correct order', function(done) {
        var updateCount = 0;

        var engine = compo.createEngine()
            .registerComponent('compo_A', function() {
                return {
                    update: function() {
                        expect(updateCount === 0 ||
                               updateCount === 1).to.be.true;
                        updateCount++;
                    }
                };
            })
            .registerComponent('compo_B', function() {
                return {
                    update: function() {
                        expect(updateCount === 2 ||
                               updateCount === 3).to.be.true;
                        updateCount++;
                    }
                };
            })
            .registerComponent('compo_C', function() {
                return {
                    update: function() {
                        expect(updateCount === 4 ||
                               updateCount === 5).to.be.true;
                        updateCount++;
                    }
                };
            });

        // Components should be updated in the order:
        //   -> A, A, B, B, C, C
        // ...due to the above registration order.
        engine.createEntity()
            .addComponent('compo_C')
            .addComponent('compo_B')
            .addComponent('compo_A');
        engine.createEntity()
            .addComponent('compo_C')
            .addComponent('compo_B')
            .addComponent('compo_A');

        engine.tick();
        expect(updateCount).to.equal(2 * 3);    // 2 entities * 3 components per entity

        done();
    });
});
