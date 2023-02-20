const requet=require('supertest')
const app=require('../../app')
const {mongoConnect,mongoDisconnect} =require('../../services/mongo');


describe('Launches API',()=>{
    beforeAll(async()=>{
        await mongoConnect();
    });
    afterAll(async()=>{
        await mongoDisconnect();
    })
    describe('test GET/launches',()=>{
        test('It should respond with 200 success',async ()=>{
            const response=await requet(app).get('/launches');
            expect(response.statusCode).toBe(200);
        });
    })
    
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
    })
})