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

function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

function getAllLaunches(){
    return Array.from(launches.values());
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