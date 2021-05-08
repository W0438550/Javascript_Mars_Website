/**
 * Authors: ['Atenati Weber-Morrison', 'Siddhart Soojhawon']
 * Date: April 20, 2021
 * 
 * References:
 * Gathering array object min/max value of it's properties
 * Reference: https://stackoverflow.com/questions/53097817/javascript-objects-array-filter-by-minimum-value-of-an-attribute
 * Math.Max(...array.map(to filter by))
 * from Lloyd
 * 
 * Gathering current date in format yyyy-mm-dd
 * Reference: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
 * from Fernando Aguilar & Ruslan Lopez
 * 
 * API 'Asteroids NeoWs' used from NASA
 * Reference: https://api.nasa.gov/
 * This API is maintained by SpaceRocks Team: David Greenfield, Arezu Sarvestani, Jason English and Peter Baunach.
 * with key: GJZQEgWqw8iBLDC7wHsS65rd2iYeGcs4W0mttCLf
 * 
 * Order and links of importing jquery and toastr.css and toastr.js to add toastr functionality
 * Reference: https://stackoverflow.com/questions/16549885/how-do-i-implement-toastr-js
 * from Anto King
 */

var todayDate = new Date().toISOString().slice(0, 10);
var todayYear = todayDate.slice(0, 4);
var api_key = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + todayDate + '&end_date=' + todayDate + '&api_key=GJZQEgWqw8iBLDC7wHsS65rd2iYeGcs4W0mttCLf';

/**
 * Returns asteroid with smallest miss distance
 * @param {*} asteroids 
 * @returns 
 */
function getSmallestMissDistance(asteroids) {
    let missDistances = [];
    for(let i = 0; i < asteroids.length; i++) { // populate miss distances
        missDistances.push(asteroids[i].miss_km);
    }
    let minDistance = Math.min(...missDistances); // gets smallest
    return asteroids.filter(arr => arr.miss_km.includes(minDistance)); // returns asteroid with smallest miss distance
}

/**
 * 
 * @param {*} asteroids 
 * @returns 
 */
function getAvgAsteroidSize(asteroids) {
    let total = 0;
    for(let i = 0; i < asteroids.length; i++) {
        total += asteroids[i].avg_diameter_km;
    }
    return total / asteroids.length;
}

/**
 * Returns list of asteroids marked as potentially hazardous
 * @param {*} asteroids 
 * @returns 
 */
function numberHazardousAsteroids(asteroids) {
    return asteroids.filter(arr => arr.isHazardous == true);
}

/**
 * 
 * @param {*} asteroids 
 * @param {*} year 
 * @returns 
 */
function stringListAsteroidsByYear(asteroids, year) {
    let master = "";
    let thisyears = asteroids.filter(arr => arr.name.includes(year));
    for(let i = 0; i < thisyears.length; i++) {
        master += thisyears[i].name.replace(todayYear, '').replace('(', '').replace(')', '') + ", ";
    }
    return master.slice(0, master.length - 2); // remove final comma
}

/**
 * returns asteroid with earliest date discovered
 * @param {*} asteroids 
 * @returns 
 */
function oldestAsteroidInOrbit(asteroids) {
    let oldest = Math.min(...asteroids.map(arr => arr.date_discovered)); // get earliest date discovered
    return asteroids.filter(arr => arr.date_discovered == oldest); // return asteroids with that date
}

/**
 * returns asteroid with math.max (highest) speed
 * @param {*} asteroids 
 * @returns 
 */
function fastestAsteroid(asteroids) {
    return Math.max(...asteroids.map(arr => arr.vel_kmh));
}

/**
 * returns asteroid containing the longest name
 * @param {*} asteroids 
 * @returns 
 */
function longestName(asteroids) {
    let namesize = Math.max(...asteroids.map(arr => arr.name.length)); // set namesize
    return asteroids.filter(arr => arr.name.length == namesize);
}

/**
 * On button click
 * display third party js toastr message
 */
function buttonClickFunction() {
    if(numberHazardousAsteroids(data).length > 0) {
        console.log("test");
        Command: toastr["warning"]("There are " + numberHazardousAsteroids(data).length + " potentially dangerous asteroids near earth today")
    } else {
        Command: toastr["warning"]("There are no dangerous asteroids near earth today... maybe tomorrow")
    }
}
    
var data = [];
fetch(api_key) // fetch nasa near earth object api
.then((resp) => resp.json())
.then(function(res) {
    var asteroids = [];

    // create array of todays asteroids from Near Earth Object API
    for(let i = 0; i < res.near_earth_objects[todayDate].length; i++) {
        asteroids.push(res.near_earth_objects[todayDate][i]);
    }

    // Format json into more usable information
    this.data = asteroids.map(obj => {
        return {
            'name' : obj.name,
            'miss_km' : obj.close_approach_data[0].miss_distance.kilometers,
            'vel_kmh' : obj.close_approach_data[0].relative_velocity.kilometers_per_hour,
            'avg_diameter_km' : (obj.estimated_diameter.kilometers.estimated_diameter_max + obj.estimated_diameter.kilometers.estimated_diameter_min) / 2,
            'isHazardous' : obj.is_potentially_hazardous_asteroid,
            'close_approach_datetime' : obj.close_approach_data[0].close_approach_date_full,
            'date_discovered' : obj.name.replace('(', '').split(' ').length == 3 ? obj.name.replace('(', '').split(' ')[1] : obj.name.replace('(', '').split(' ')[0]
        }
    });

    // set DOM attributes
    document.getElementById("earthdate").innerHTML = `${"Asteroid " + getSmallestMissDistance(data)[0].name + " missed earth today by " + Math.floor(getSmallestMissDistance(data)[0].miss_km) + "km"}`;
    document.getElementById("i2").innerHTML = `${"Average asteroid diameter today: " + getAvgAsteroidSize(data).toFixed(2) + "km"}`;
    document.getElementById("i3").innerHTML = `${"Asteroids near earth today that were discovered this year " + stringListAsteroidsByYear(data, todayYear)}`;
    document.getElementById("i4").innerHTML = `${"The asteroid " + oldestAsteroidInOrbit(data)[0].name.slice(oldestAsteroidInOrbit(data)[0].name.length - 5, oldestAsteroidInOrbit(data)[0].name.length - 1) + " has been orbiting earth since the year " + oldestAsteroidInOrbit(data)[0].date_discovered} making it the oldest`;
    document.getElementById("i5").innerHTML = `${"The fastest asteroid orbiting us today was going " + Math.floor(fastestAsteroid(data)) + "km/h"}`;
    document.getElementById("i6").innerHTML = `${"There were " + asteroids.length + " asteroids near earth today"}`;
    document.getElementById("i7").innerHTML = `${"The asteroid with the longest name was called " + longestName(data)[0].name}`;
});
