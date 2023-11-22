const {getAllLaunches, scheduleNewLauch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res){
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    const dty = new Date(launch.launchDate);
    if (!launch.mission || !launch.rocket  || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }

    if(launch.launchDate) {
        if(isNaN(dty)) {
            return res.status(400).json({
                error: 'Invalid Date Format',
            });
        }
    }
    await scheduleNewLauch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);

    if(!existsLaunch) {
        return res.status(404).json({
            error: 'Launch does not exist'
        });
    }

    const aborted = await abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error: 'Launch was not aborted',
        });
    }
    return res.status(200).json({aborted: true});
}



module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAddNewLaunch,
    httpAbortLaunch,
}