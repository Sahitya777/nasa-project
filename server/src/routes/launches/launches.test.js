const requet=require('supertest')
const app=require('../../app');
const { loadLaunchesData } = require('../../models/launches.model');
const {mongoConnect,mongoDisconnect} =require('../../services/mongo');
jest.setTimeout(50000);

describe('Launches API',()=>{
    beforeAll(async()=>{
        await mongoConnect();
        await loadLaunchesData();
        jest.setTimeout(50000);
    },50000);
    afterAll(async()=>{
        await mongoDisconnect();
        jest.setTimeout(50000);
    })
    describe('test GET/launches',()=>{
        test('It should respond with 200 success',async ()=>{
            const response=await requet(app).get('/launches');
            expect(response.statusCode).toBe(200);
        });
    },50000)
    
    describe('Test POST/launch',()=>{
        test('It should response with 200 success',async()=>{
            const response=await requet(app).post('/launches').send({
                mission:'USS Enterprise',
                rocket:'NCC 1701-D',
                destination:'Kepler-62 f',
                launchDate:'January 5, 2030',
            })
            .expect('Content-Type',/json/)
            .expect(201)
    
            // expect(response.body).toMatchObject({
            //     mission:'USS Enterprise',
            //     rocket:'NCC 1701-D',
            //     destination:'Kepler-62 f',
            //     launchDate:'January 5, 2030',
            // });
        });
        test('It should catch missing required properties',()=>{})
        test('It should catch invalid dates',()=>{})
    },50000)
})