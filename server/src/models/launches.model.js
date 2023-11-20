const launches = new Map();
var latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    lauchDate: new Date('December 27, 30'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true

};

launches.set(launch.flightNumber, launch);

function getAllLaunches(){
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launch.flightNumber = latestFlightNumber;
    launches.set(
        latestFlightNumber, 
        Object.assign(launch, 
            {
                customer: ['ZTM', 'NASA'],
                flightNumber: latestFlightNumber,
                upcoming: true,
                success: true,
            }));
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
}