const apiKey = '';

export default async function addressToPos(address) {
    try{
      const data = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
      const pos = await data.json();
      return pos.results[0].geometry.location;
    } catch(e){
      console.log(e);
    }
}
