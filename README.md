# leaflet-rxjs

# Using Subjects #

```js

// Event
map.on('click', function(event) {
	console.log('Executed as a callback');
});

// RxJs observable
var observable = map.observable('click');

observable.subscribe(function(event) {
    console.log('Executed as an observable', event);
});


```


## API Reference ##

observable(type)
- Accepts Leaflet event names.

replayObservable(type)
- Stores all the values that it has published. Therefore, when you subscribe to it, you automatically receive an entire history of values that it has published, even though your subscription might have come in after certain values have been pushed out.

asyncObservable(type)
- Will only store the last value, and only publish it when the observer is unsubscribed using off().