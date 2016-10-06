# leaflet-rxjs

leaflet-rxjs allows you to harness the power of reactive programming in your Leaflet map. This package piggybacks on the existing Leaflet event system and adds functionality to any event emitting Leaflet object. 

## Requirements ##
- Leaflet ^1.0.0
- RxJS ^5.0.0

## What is Reactive Programming ##

[staltz](https://github.com/staltz) has a written good [overview](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

# Use #

Instead of registering a callback with Leaflet's .on() method we instead request a new observable. All Leaflet event types can be returned as an observable. See the Leaflet [documentation](http://leafletjs.com/reference.html) for the full list of event types.

# Example #

```js

// Registering an event with regular Leaflet
map.on('click', function(event) {
	console.log('Executed as a callback');
});

// Registering an event with leaflet-rxjs
// Returns a RxJS observable
var observable = map.observable('click');

observable.subscribe(function(event) {
    console.log('Executed as an observable', event);
});


```

# API Reference #

observable(type)
- Accepts Leaflet event names.

replayObservable(type)
- Stores all the values that it has published. Therefore, when you subscribe to it, you automatically receive an entire history of values that it has published, even though your subscription might have come in after certain values have been pushed out.

asyncObservable(type)
- Will only store the last value, and only publish it when the observer is unsubscribed using off().