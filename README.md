# leaflet-rxjs

leaflet-rxjs allows you to harness the power of reactive programming with Leaflet. This package adds observable functionality to any event generating Leaflet object.

## Requirements ##
- [Leaflet](http://leafletjs.com/) ^1.0.0
- [RxJS](https://github.com/Reactive-Extensions/RxJS) ^5.0.0

# What is Reactive Programming? ##
Reactive Programming lets you represent a series of independent events as a stream of data rather than a series of callback calls. This approach encourages clean, concise code that is easy to reason about. Observables also have array-like functions such as map, filter, and reduce which can operate on these data streams.

[staltz](https://github.com/staltz) wrote a good [overview](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

# Use #
Register your event with one of the observable creation methods. All existing Leaflet event types can be returned as observables. See the Leaflet [documentation](http://leafletjs.com/reference.html) for the full list of event types.

# API Reference #

### `observable(types: String): Rx.Observable`

Get an rxjs observable for the supplied Leaflet event types. When a subscriber joins they receive all subsequent events.

 * **Parameters:** `types` — `string` — Leaflet event types. Multiple allowed, separated by commas.
 * **Returns:** `Rx.Observable`

### `asyncObservable(types: String): Rx.Observable`

Get an rxjs asyc observable for the supplied Leaflet event types. This observable will store the last event, and will only publish the event when the observable is unsubscribed using Leaflet's off() method.

 * **Parameters:** `types` — `string` — Leaflet event types. Multiple allowed, separated by commas.
 * **Returns:** `Rx.Observable`

### `replayObservable(types: String): Rx.Observable`

Get an rxjs replay observable for the supplied Leaflet event types. A buffer of previous events is stored. When a subscriber joins they receive event history and further events.

 * **Parameters:** `types` — `string` — Leaflet event types. Multiple allowed, separated by commas.
 * **Returns:** `Rx.Observable`

# Example #

```js

// Registering an event callback in regular Leaflet fashion
map.on('zoomend', function(event) {
	console.log('Executed as a Leaflet on callback', event);
});

// Registering events with leaflet-rxjs
var mapObservable = map.observable('click dblclick');

// Subscribe to the observable
mapObservable.subscribe(function(event) {
    console.log('Executed from an observable', event);
});
// Multiple subscribers are supported
mapObservable.subscribe(function(event) {
    console.log('Second subscriber', event);
});

// Unregister the mapObservable after 60 seconds
setTimeout(function(){
	map.off('moveend', mapObservable);
}, 60000);

// Also works on other objects (any Leaflet object with event support)
var popup = L.popup()
    .setLatLng(latlng)
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(map);

var popupObservable = popup.observable('click');
popupObservable.subscribe(function(event) {
    console.log('Executed on a click to the popup', event);
});

```