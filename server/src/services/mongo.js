const mongoose=require('mongoose')

const MONGO_URL='mongodb+srv://sahityanijhawan:sahitya7@cluster9.e4pmor0.mongodb.net/?retryWrites=true&w=majority'

mongoose.connection.once('open',()=>{
    console.log('Mongo db connection ready');
})

mongoose.connection.on('error',(err)=>{
    console.log(err);
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports={mongoConnect,mongoDisconnect};