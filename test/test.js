var EventEmitter = require('events');
var sinon = require('sinon');
var EventListener = require('..');

describe('EventListener.listenTo', function() {
    var emitter, listener, handler;

    beforeEach(function() {
        emitter = new EventEmitter();
        listener = new EventListener();
        handler = sinon.spy();
    });

    it('should listen for events', function() {
        listener.listenTo(emitter, 'test', handler);
        emitter.emit('test');
        emitter.emit('test');
        sinon.assert.calledTwice(handler);
    });

    it('should pass on parameter from events', function() {
        listener.listenTo(emitter, 'test', handler);
        emitter.emit('test', 1, 2, 3);
        sinon.assert.calledOnce(handler);
        sinon.assert.calledWith(handler, 1, 2, 3);
    });

    it('should stop listening for events', function() {
        listener.listenTo(emitter, 'test', handler);
        emitter.emit('test');
        listener.stopListening();
        emitter.emit('test');
        sinon.assert.calledOnce(handler);
    });

    it('should stop listening for events from a specific emitter', function() {
        var emitter2 = new EventEmitter();
        var handler2 = sinon.spy();

        listener.listenTo(emitter, 'test', handler);
        listener.listenTo(emitter2, 'test', handler2);

        emitter.emit('test');
        emitter2.emit('test');
        listener.stopListening(emitter2);
        emitter.emit('test');
        emitter2.emit('test');
        sinon.assert.calledTwice(handler);
        sinon.assert.calledOnce(handler2);
    });

    it('should stop listening for a specific event', function() {
        var handler2 = sinon.spy();

        listener.listenTo(emitter, 'test', handler);
        listener.listenTo(emitter, 'other', handler2);

        emitter.emit('test');
        emitter.emit('other');
        listener.stopListening(emitter, 'other');
        emitter.emit('test');
        emitter.emit('other');
        sinon.assert.calledTwice(handler);
        sinon.assert.calledOnce(handler2);
    });

    it('should stop listening for a specific handler', function() {
        var handler2 = sinon.spy();

        listener.listenTo(emitter, 'test', handler);
        listener.listenTo(emitter, 'test', handler2);

        emitter.emit('test');
        listener.stopListening(emitter, 'test', handler2);
        emitter.emit('test');
        sinon.assert.calledTwice(handler);
        sinon.assert.calledOnce(handler2);
    });
});

describe('EventListener.listenToOnce', function() {
    var emitter, listener, handler;

    beforeEach(function() {
        emitter = new EventEmitter();
        listener = new EventListener();
        handler = sinon.spy();
    });

    it('should listen for events once', function() {
        listener.listenToOnce(emitter, 'test', handler);
        emitter.emit('test');
        sinon.assert.calledOnce(handler);
    });

    it('should pass on parameter from events', function() {
        listener.listenToOnce(emitter, 'test', handler);
        emitter.emit('test', 1, 2, 3);
        sinon.assert.calledOnce(handler);
        sinon.assert.calledWith(handler, 1, 2, 3);
    });

    it('should stop listening for events', function() {
        listener.listenToOnce(emitter, 'test', handler);
        listener.stopListening();
        emitter.emit('test');
        sinon.assert.notCalled(handler);
    });

    it('should stop listening for events from a specific emitter', function() {
        var emitter2 = new EventEmitter();
        var handler2 = sinon.spy();

        listener.listenToOnce(emitter, 'test', handler);
        listener.listenToOnce(emitter2, 'test', handler2);

        listener.stopListening(emitter2);
        emitter.emit('test');
        emitter2.emit('test');
        sinon.assert.calledOnce(handler);
        sinon.assert.notCalled(handler2);
    });

    it('should stop listening for a specific event', function() {
        var handler2 = sinon.spy();

        listener.listenToOnce(emitter, 'test', handler);
        listener.listenToOnce(emitter, 'other', handler2);

        listener.stopListening(emitter, 'other');
        emitter.emit('test');
        emitter.emit('other');
        sinon.assert.calledOnce(handler);
        sinon.assert.notCalled(handler2);
    });

    it('should stop listening for a specific handler', function() {
        var handler2 = sinon.spy();

        listener.listenToOnce(emitter, 'test', handler);
        listener.listenToOnce(emitter, 'test', handler2);

        listener.stopListening(emitter, 'test', handler2);
        emitter.emit('test');
        sinon.assert.calledOnce(handler);
        sinon.assert.notCalled(handler2);
    });
});
