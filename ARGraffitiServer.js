const admin = require('firebase-admin');
const geofire = require('geofire');

const API_TOKEN = 'AIzaSyC0pFkaz03pIaitbPYo4p1HUZjlp9DlD1w';

admin.initializeApp({
	credential: admin.credential.cert('./argraffiti-1e48b-firebase-adminsdk-o5hla-4612866f5c.json'),
	databaseURL: 'https://argraffiti-1e48b.firebaseio.com/'
});
const ref = admin.database().ref();
const geoFire = new geofire(admin.database().ref('graffitiLocation'));

function listenForGraffitiInserts() {
	const requests = ref.child('graffitiQueue');
	const graffitiRef = ref.child('graffiti');
	requests.on('child_added', requestSnapshot => {
		const request = requestSnapshot.val(),
				strokes = request.strokes,
				lat = parseFloat(request.latitude),
				lon = parseFloat(request.longitude);

		const newGraffitiRef = graffitiRef.push();
		newGraffitiRef.set({
			strokes
		});

		geoFire.set(newGraffitiRef.key, [lat, lon])
			.then(() => {
				console.log('uploaded');
			}, err => console.log(err))
			.then(() => requests.child(requestSnapshot.key).remove());
	});
}

listenForGraffitiInserts();
