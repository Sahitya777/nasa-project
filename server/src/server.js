const http=require('http')
const mongoose=require('mongoose')
const app=require('./app')

const {loadPlanetsData}=require('./models/planets.model')

const MONGO_URL='mongodb+srv://sahityanijhawan:sahitya7@cluster9.e4pmor0.mongodb.net/?retryWrites=true&w=majority'

const PORT=process.env.PORT || 8000;

const server=http.createServer(app);

mongoose.connection.once('open',()=>{
    console.log('Mongo db connection ready');
})

mongoose.connection.on('error',(err)=>{
    console.log(err);
})
async function  startServer(){
    await mongoose.connect(MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    await loadPlanetsData();
    
    server.listen(PORT,()=>{
        console.log('Port starting')
    })
}
startServer();