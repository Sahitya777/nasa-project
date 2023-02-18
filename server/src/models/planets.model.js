const fs = require('fs');
const path=require('path')
const {parse} =require('csv-parse')

const Allplanets=require('./planets.mongo')

function isHabitable(planet){
    return planet['koi_disposition']=='CONFIRMED' && planet['koi_insol']>0.36 
    &&planet['koi_insol']<1.11 &&planet['koi_prad']<1.6;
}

function  loadPlanetsData(){
    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
        comment:'#',
        columns:true,
    }))
    .on('data',async (data)=>{
        if(isHabitable(data)){
            try{
                await Allplanets.updateOne({
                    kepler_name:data.kepler_name,
                },{
                    kepler_name:data.kepler_name
                },{
                    upsert:true,
                });
            }catch(err){
                console.log(err);
            }
        }
    }).on('error',(err)=>{
        console.log(err);
        reject(err);
    })
    .on('end',()=>{
        console.log('done');
        resolve();
    });
})
}

async function getPlanets(){
    return await Allplanets.find({},{
        '_id':0,'__v':0
    });
}


module.exports={
    loadPlanetsData,
    getPlanets,
}

