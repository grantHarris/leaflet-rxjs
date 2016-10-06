# leaflet-rxjs

leaflet-rxjs allows you to harness the power of reactive programming in your Leaflet map. This package piggybacks on the existing Leaflet event system and adds functionality to any event emitting Leaflet object. 

## Requirements ##
- [Leaflet](http://leafletjs.com/) ^1.0.0
- [RxJS](https://github.com/Reactive-Extensions/RxJS) ^5.0.0

# What is Reactive Programming ##

[staltz](https://github.com/staltz) wrote a good [overview](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

# Use #

Register your event with one of the observable creation methods. All existing Leaflet event types can be returned as observables. See the Leaflet [documentation](http://leafletjs.com/reference.html) for the full list of event types.

# API Reference #

observable(String type) : Rx.Observable
- Just like with on(), you can pass several space-separated types (e.g. 'click dblclick') to subscribe to multiple event types. 

replayObservable(type: String) : Rx.Observable
- Stores all the events that it has published. Therefore, when you subscribe to it, you automatically receive an entire history of events that it has published, even though your subscription might have come after.

asyncObservable(type: String) : Rx.Observable
- Will store the last event, and only publish it when the event us unsubscribed using off().

off(type: String, fn?: Function | Rx.Observable, context?: Object): this
- Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.

# Example #

```js

// Registering an event callback in regular Leaflet fashion
map.on('zoomend', function(event) {
	console.log('Executed as a callback');
});

// Registering an event with leaflet-rxjs
// Returns a RxJS observable
var mapObservable = map.observable('moveend');

mapObservable.subscribe(function(event) {
    console.log('Executed as an observable', event);
});

// Unregister from all event handling in 60 seconds
setTimeout(function(){
	map.off('moveend', mapObservable);
}, 60000);

// Also works on other objects
var popup = L.popup()
    .setLatLng(latlng)
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(map);

var popupObservable = popup.observable('click');
popupObservable.subscribe(function(event) {
    console.log('Executed on a click to the popup', event);
});

```