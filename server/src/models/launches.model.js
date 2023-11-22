// const launches = new Map();
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFUALT_FLIGHT_NUMBER = 100;

// var latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 30'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true

};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getAllLaunches(){
    // return Array.from(launches.values())
    return await launches.find({},
        {'_id': 0, '__v': 0});
}

async function existsLaunchWithId(launchId){
    return await launches.findOne({
        flightNumber: launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber');

    if(!latestLaunch){
        return DEFUALT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function saveLaunch(launch){
    const planet = await planets.findOne({keplerName : launch.target});
    if (!planet) {
        throw new Error('No matching planet found!');
    }
    await launches.findOneAndUpdate(
        {flightNumber: launch.flightNumber},
        launch,
        {upsert: true},
        );

}

async function scheduleNewLauch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        customer: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
        upcoming: true,
        success: true,
    })

    await saveLaunch(newLaunch);
}


async function abortLaunchById(launchId){

    const aborted = await launches.updateOne(
        {flightNumber: launchId},
        {
            upcoming: false,
            success: false,
        }
       
        );
    return aborted.acknowledged === true && aborted.modifiedCount === 1;

}

module.exports = {
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLauch,
    existsLaunchWithId,
    abortLaunchById,
}