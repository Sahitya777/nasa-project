const launchesDatabase=require('./launches.mongo')
const planets=require('./planets.mongo')
const axios=require('axios')


const DEFAULT_FLIGHT_NUMBER=100;

async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert:true,
    });
}


async function existsLaunchWithId(launchId){
    return await findLaunch({
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

async function getAllLaunches(skip,limit){
    return await launchesDatabase.find({},{
        '_id':0,'__v':0
    }).sort({flightNumber:1}).skip(skip).limit(limit);
}

async function scheduleNewLaunch(launch){
    const planet=await planets.findOne({
        kepler_name:launch.destination
    })
    if(!planet){
        throw new Error('No matching planet found');
    }
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

const SPACEX_URL="https://api.spacexdata.com/v5/launches/query"

async function populateLaunches(){
    console.log('Downloading launch Data');
    const response=await axios.post(SPACEX_URL,{
        query:{},
        options:{
            pagination:false,
            populate:[{
                path:'rocket',
                select:{
                    name:1
                }   
            },{
                path:'payloads',
                select:{
                    'customers':1
                }
            }]
        }
    })
    if(response.status!==200){
        console.log('Problem downloading data');
        throw new Error('Launch data download failed')
    }
    const launchDocs=response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads=launchDoc['payloads'];
        const customers=payloads.flatMap((payload)=>{
            return payload['customers'];
        })
        const launch={
            flightNumber:launchDoc['flight_number'],
            mission:launchDoc['name'],
            rocket:launchDoc['rocket']['name'],
            launchDate:launchDoc['date_local'],
            upcoming:launchDoc['upcoming'],
            success:launchDoc['success'],
            customers:customers
        }
        console.log(launch.flightNumber);

        await saveLaunch(launch);
    }
}

async function loadLaunchesData(){
    const firstLanch=await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'FalconSat',
        
    })
    if(firstLanch){
        console.log('Launch data already loaded');
    }else{
        await populateLaunches();
    }
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);

}

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
    loadLaunchesData,
    abortLaunchById,
}