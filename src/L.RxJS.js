'use strict';

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['leaflet', 'rxjs/Subject', 'rxjs/AsyncSubject', 'rxjs/ReplaySubject'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('leaflet', 'rxjs/Subject', 'rxjs/AsyncSubject', 'rxjs/ReplaySubject'));
    } else {
        factory(L, rxjs.Subject, rxjs.AsyncSubject, rxjs.ReplaySubject);
    }
}(function(L, Subject, AsyncSubject, ReplaySubject) {
    if (!Subject || !AsyncSubject || !ReplaySubject) {
        throw 'rxjs is not loaded';
    }
    if (typeof L == 'undefined') {
        throw 'Leaflet is not loaded';
    }
    if (typeof Subject !== 'function'){
        Subject = Subject.Subject
        AsyncSubject = AsyncSubject.AsyncSubject
        ReplaySubject = ReplaySubject.ReplaySubject
    }

    var ObservableMixin = {
        /**
        * Get an rxjs observable for the supplied Leaflet event types.
        * When a subscriber joins they receive all subsequent events.
        * @param {string} types - Leaflet event types. Multiple allowed, separated by commas.
        * @returns {Rx.Observable}
        */
        observable: function(types) {
            return this._observable(types, Subject);
        },

        /**
        * Get an rxjs asyc observable for the supplied Leaflet event types.
        * This observable will store the last event, and will only publish
        * the event when the observable is unsubscribed using Leaflet's off() method.
        * @param {string} types - Leaflet event types. Multiple allowed, separated by commas.
        * @returns {Rx.Observable}
        */
        asyncObservable: function(types) {
            return this._observable(types, AsyncSubject);
        },

        /**
        * Get an rxjs replay observable for the supplied Leaflet event types.
        * A buffer of previous events is stored. When a subscriber joins they receive event history and further events.
        * @param {string} types - Leaflet event types. Multiple allowed, separated by commas.
        * @returns {Rx.Observable}
        */
        replayObservable: function(types) {
            return this._observable(types, ReplaySubject);
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
                        this._offOrig(type, fn, context);
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
                // No matching rxjs events, pass through to Leaflet's _off
                this._offOrig(type, fn, context);
            }
        }
    };

    ObservableMixin._offOrig = L.Evented.prototype._off;

    L.Evented.include(ObservableMixin);
}));