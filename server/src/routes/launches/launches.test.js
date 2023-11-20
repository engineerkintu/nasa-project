const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        // expect(response.statusCode).toBe(200);
    });
});

describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: 'jjkk',
        rocket: 'hjjjj',
        target: 'Kepler-442 b', 
        launchDate: 'January 27, 2024',  
    };

    const launchDataMissingTarget = {
        mission: 'jjkk',
        rocket: 'hjjjj',
        launchDate: 'January 27, 2024',  
    };

    const completeLaunchDataWithWrongDate = {
        mission: 'jjkk',
        rocket: 'hjjjj',
        target: 'Kepler-442 b', 
        // launchDate: 'Hello',  
    };

    const launchDataWithoutDate = {
        mission: 'jjkk',
        rocket: 'hjjjj',
        target: 'Kepler-442 b', 
    };
    test('It should respond with 201 created', async () => {
        const response = await request(app)          
            .post('/launches')
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
            .post('/launches')
            .send(launchDataMissingTarget)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        })
    });

    test('It should also catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchDataWithWrongDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid Date Format',
        })
    });
})