const launchesDatabase=require('./launches.mongo')
const planets=require('./planets.mongo')

const launches=new Map();

let latestFlightNumber=100;

const launch={
    flightNumber:100,
    mission:'Kepler Exploration X',
    rocket:'Explore IS1',
    launchDate: new Date('December 27,2030'),
    destination: 'Kepler-442 b',
    customers:['ZTM','NASA'],
    upcoming:true,
    success:true,
}

launches.set(100,launch);


async function saveLaunch(launch){

    const planet=await planets.findOne({
        kepler_name:launch.destination
    })
    if(!planet){
        throw new Error('No matching planet found');
    }

    await launchesDatabase.updateOne({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert:true,
    });
}

saveLaunch(launch);

function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

async function getAllLaunches(){
    return await launchesDatabase.find({},{
        '_id':0,'__v':0
    });
}
function addNewLaunches(launch){
    latestFlightNumber++;
    const newLaunch=Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['ZTM','NASA'],
        flightNumber:latestFlightNumber
    });
    launches.set(newLaunch.flightNumber,newLaunch);
}

function abortLaunchById(launchId){
    const aborted=launches.get(launchId);
    aborted.upcoming=false;
    aborted.success=false;
    return aborted;
}

module.exports={
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunches,
    abortLaunchById
}