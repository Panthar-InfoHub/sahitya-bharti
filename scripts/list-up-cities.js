
const { City } = require("country-state-city");

const cities = City.getCitiesOfState("IN", "UP");
console.log(JSON.stringify(cities.map(c => c.name), null, 2));
