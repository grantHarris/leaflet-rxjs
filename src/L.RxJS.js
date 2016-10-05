
'use strict';

(function (factory) {
   if (typeof define === 'function' && define.amd) {
       define(['leaflet', 'Rx'], factory);
   } else if (typeof module === 'object' && module.exports) {
       module.exports = factory(require('leaflet', 'Rx'));
   } else {
       factory(L, Rx);
   }
}(function (L, Rx) {

	if (typeof Rx == "undefined") {
	    throw "RX not loaded";
	}
	if (typeof L == "undefined") {
	    throw "Leaflet library loaded first";
	}

	var ObservableMixin = {
		observable: function(types){
			this._observables = this._observables || {};
			var subject = new Rx.AsyncSubject();
			this.on(types, subject.onNext);
			//this.off(types, subject.onCompleted);
			return subject;
		},
		off: function (types, fn, context){
			this.prototype.off.call()
		}
	};
	L.Evented.include(ObservableMixin);
});