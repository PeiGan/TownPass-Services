const apiKey = 'AIzaSyCIzYd23hXr2gZ952LrUa69gWArzwq2pK4';

export default async function addressToPos(address) {
  try{
    const data = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
    const pos = await data.json();
    return pos;
  } catch(e){
    console.log(e);
  }
}
