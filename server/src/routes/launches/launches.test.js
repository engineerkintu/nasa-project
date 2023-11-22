const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });
  
    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // expect(response.statusCode).toBe(200);
        });
    });
    
    describe('Test POST /v1/launches', () => {
        const completeLaunchData = {
            mission: 'jjkk',
            rocket: 'hjjjj',
            target: 'Kepler-296 e', 
            launchDate: 'January 27, 2024',  
        };
    
        const launchDataMissingMission = {
           
            target: 'Kepler-296 e', 
            launchDate: 'January 27, 2024',  
        };
    
        const completeLaunchDataWithWrongDate = {
            mission: 'jjkk',
            rocket: 'hjjjj',
            target: 'Kepler-296 e', 
            launchDate: 'Hello',  
        };
    
        const launchDataWithoutDate = {
            mission: 'jjkk',
            rocket: 'hjjjj',
            target: 'Kepler-296 e', 
        };
        test('It should respond with 201 created', async () => {
            const response = await request(app)          
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(launchDataWithoutDate);
    
        });
    
        test('It should catch missing required propertis', async () =>{
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataMissingMission)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        });
    
        test('It should also catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchDataWithWrongDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid Date Format',
            })
        });

        
    })
})

