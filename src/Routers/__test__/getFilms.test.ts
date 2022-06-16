import request from 'supertest';
import app from '../../app';

it('get all list films', async () => {
    const response = await request(app).get('/films');
    expect(response.status).toBe(200);
});