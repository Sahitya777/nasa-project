const launchesDatabase=require('./launches.mongo')
const planets=require('./planets.mongo')

const launches=new Map();

const DEFAULT_FLIGHT_NUMBER=100;

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

    await launchesDatabase.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert:true,
    });
}

saveLaunch(launch);

async function existsLaunchWithId(launchId){
    return await launchesDatabase.findOne({
        flightNumber:launchId
    });
}

async function getLatestFlightNumber(){
    const latestLaunch=await launchesDatabase.findOne().sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;

}

async function getAllLaunches(){
    return await launchesDatabase.find({},{
        '_id':0,'__v':0
    });
}

async function scheduleNewLaunch(launch){
    const newFlightNumber=await getLatestFlightNumber()+1;
    const newLaunch=Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['ZTM','NASA'],
        flightNumber:newFlightNumber
    })
    console.log(newFlightNumber);
    await saveLaunch(newLaunch);
}

// function addNewLaunches(launch){
//     latestFlightNumber++;
//     const newLaunch=Object.assign(launch,{
//         success:true,
//         upcoming:true,
//         customers:['ZTM','NASA'],
//         flightNumber:latestFlightNumber
//     });
//     launches.set(newLaunch.flightNumber,newLaunch);
// }

async function abortLaunchById(launchId){

    const aborted= await launchesDatabase.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        success:false
    })
    return aborted.ok==1 && aborted.nModified==1;
    // const aborted=launches.get(launchId);
    // aborted.upcoming=false;
    // aborted.success=false;
    // return aborted;
}

module.exports={
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}