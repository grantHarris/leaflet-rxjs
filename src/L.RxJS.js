'use strict';

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['leaflet', 'rxjs'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('leaflet', 'rxjs'));
    } else {
        factory(L, rxjs);
    }
}(function(L, Rx) {
    if (typeof Rx == 'undefined') {
        throw 'rxjs is not loaded';
    }
    if (typeof L == 'undefined') {
        throw 'Leaflet is not loaded';
    }

    var ObservableMixin = {
        observable: function(types) {
            return this._observable(types, Rx.Subject);
        },
        asyncObservable: function(types) {
            return this._observable(types, Rx.AsyncSubject);
        },
        replayObservable: function(types) {
            return this._observable(types, Rx.ReplaySubject);
        },
        _observable: function(types, SubjectClass) {
            this._rxjsEvents = this._rxjsEvents || {};

            var observables = this._rxjsEvents[types];
            if (!observables) {
                observables = [];
                this._rxjsEvents[types] = observables;
            }

            var subject = new SubjectClass();
            var observable = subject.asObservable()

            var fn = function(event) {
                subject.next(event);
            };

            observables.push({
                subject: subject,
                observable: observable,
                fn: fn
            });

            this.on(types, fn);

            return observable;
        },
        _off: function(type, fn, context) {
            if (this._rxjsEvents && this._rxjsEvents[type]) {
                var events = this._rxjsEvents[type];

                // If we have a passed in observable fn, filter out any other observables
                if (fn) {
                    events = events.filter(function(event) {
                        return (event.observable === fn);
                    });

                    if (events.length === 0) {
                        // Not found, pass through to Leaflet's _off
                        this._offOrig.call(type, fn, context);
                        return;
                    }
                }

                // Send complete to each observable and pass in the callback for Leaflet's _off fn
                events.map(L.bind(function(event) {
                    event.subject.complete();
                    this._offOrig(type, event.fn);
                }, this));

                if (fn) {
                    this._rxjsEvents[type] = this._rxjsEvents[type].filter(function(event) {
                        return (event.observable !== fn);
                    });

                } else {
                    delete this._rxjsEvents[type];
                }

            } else {
                // No matching rxjs events, pass through toLeaflet's _off
                this._offOrig.call(type, fn, context);
            }
        }
    };

    ObservableMixin._offOrig = L.Evented.prototype._off;

    L.Evented.include(ObservableMixin);
}));