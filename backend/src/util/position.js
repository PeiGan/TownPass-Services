const apiKey = 'AIzaSyBY2mVI9l_6M0gmZVrpeqzAa0B9j71DQks';

export default function addressToPos(address) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else {
        console.log('failed');
        return {
          lat: undefined,
          lng: undefined
        };
      }
    })
    .catch((error) => console.error('Error: ', error));
}