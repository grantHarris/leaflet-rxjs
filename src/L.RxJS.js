'use strict';

(function (factory) {
   if (typeof define === 'function' && define.amd) {
       define(['leaflet', 'rxjs'], factory);
   } else if (typeof module === 'object' && module.exports) {
       module.exports = factory(require('leaflet', 'rxjs'));
   } else {
       factory(L, rxjs);
   }
}(function (L, Rx) {
	if (typeof Rx == 'undefined') {
	    throw "rxjs not loaded";
	}
	if (typeof L == 'undefined') {
	    throw 'Leaflet not loaded';
	}

	var ObservableMixin = {
		observable: function(types){
			return this._observable(types, Rx.Subject);
		},
		asyncObservable: function(types){
			return this._observable(types, Rx.AsyncSubject);
		},
		replayObservable: function(types){
			return this._observable(types, Rx.ReplaySubject);
		},
		_observable: function(types, SubjectClass){
			this._rxjsEvents = this._rxjsEvents || {};

			var subjects = this._rxjsEvents[types];
			if (!subjects) {
				subjects = [];
				this._rxjsEvents[types] = subjects;
			}

			var subject = new SubjectClass();
			var fn = function(event){
				subject.next(event);
			};

			subjects.push({
				subject: subject,
				fn: fn
			});

			this.on(types, fn);

			return subject.asObservable();
		}
	};

	L.Evented.include(ObservableMixin);
}));