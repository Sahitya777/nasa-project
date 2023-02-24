const request = require('supertest');
const app = require('../../app');
const { 
  mongoConnect,
  mongoDisconnect,
} = require('../../services/mongo');
const {
  loadPlanetsData,
} = require('../../models/planets.model');



describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  },30000);

  afterAll(async () => {
    await mongoDisconnect();
    jest.setTimeout(() => {

    }, 30000);
  },30000);

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  },30000);
  
  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 5, 2030',
    };
  
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    };
  
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'zoot',
    };
  
    test('It should respond with 200 created', async () => {
        const response=await request(app).post('/launches').send({
            mission:'USS Enterprise',
            rocket:'NCC 1701-D',
            destination:'Kepler-62 f',
            launchDate:'January 5, 2030',
        })
        .expect('Content-Type',/json/)
        .expect(201)

    });
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
    });
  },30000);
});