const { getAllLaunches,addNewLaunches,existsLaunchWithId,abortLaunchById } = require("../../models/launches.model")

async function httpGetAllLaunches(req,res){
    return  res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req,res){
    const launch=req.body;

    if(!launch.mission || !launch.rocket ||!launch.launchDate || !launch.destination){
        return res.status(400).json({
            error:'Missing required launch property',
        })
    }
    launch.launchDate=new Date(launch.launchDate);
    if(launch.launchDate.toString()==='Invalid Date'){
        return res.status(400).json({
            error:'Invalid launch date'
        })
    }

    await addNewLaunches(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req,res){
    const launchId=Number(req.params.id);
    console.log(existsLaunchWithId(launchId));
    if(!existsLaunchWithId(launchId)){
        return res.status(404).json({
            error:'Launch not found'
        })
    }
    const aborted=abortLaunchById(launchId);
    return res.status(200).json(aborted)

}



module.exports={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}