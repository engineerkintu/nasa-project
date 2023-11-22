const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const planets = require('./planets.mongo');



function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','data','keplar_data.csv'))
        .pipe(parse.parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)){
                // habitablePlanets.push(data);
                savePlanet(data);
            }
            
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const planetsFound =  (await getAllPlanets()).length;
            console.log(`${planetsFound} habitable planets found!`);
            resolve();
        });
    });
   

}

async function savePlanet(planet){
   try {
    await  planets.updateOne({
        keplerName: planet.kepler_name,
      },{
        keplerName: planet.kepler_name,
      },{
        upsert: true,
      });
   } catch(err) {
        console.log(`Could not save planet ${err}`)
   }
}

async function getAllPlanets (){
    // return habitablePlanets;
    return await planets.find({},{
        '_id': 0, '__v': 0,
    });
}




module.exports = {
    loadPlanetsData,
    getAllPlanets,
};