import request from 'supertest';
import app from '../../app';

beforeAll(async () => {
    const response = await request(app).get('/films');
    expect(response.status).toBe(200);
});

const testFavoriteData = {
    id: 1,
    name: 'test',
    movie: [1, 2, 3]
}

describe('test favorites create function', function() {

    it('create favorite successfully', async () => {
        const response = await request(app).post('/favorites').send({
            name: testFavoriteData.name,
            movie: testFavoriteData.movie
        });

        expect(response.status).toBe(200);
        expect(response.body["favorite"]).toEqual({id: testFavoriteData.id, name: testFavoriteData.name});
    });

    it('create favorite with no name', async () => {
        const response = await request(app).post('/favorites').send({
            name: '',
            movie: testFavoriteData.movie
        });

        expect(response.status).toBe(400);
    });

    it('create favorite with no movie', async () => {
        const response = await request(app).post('/favorites').send({
            name: testFavoriteData.name,
            movie: []
        });

        expect(response.status).toBe(400);
    });

    it('create favorite with no movie and no name', async () => {
        const response = await request(app).post('/favorites').send({
            name: '',
            movie: []
        });

        expect(response.status).toBe(400);
    });

});

describe('test favorites get all function', function() {

    beforeAll(async () => {
        await request(app).post('/favorites').send({
            name: 'test1',
            movie: [1, 2, 3]
        });

        await request(app).post('/favorites').send({
            name: 'test2',
            movie: [4, 5, 1]
        });
    });

    it('get all favorites', async () => {
        const response = await request(app).get('/favorites?search=test&page=1');

        expect(response.status).toBe(200);
        expect(response.body["favorite"]).toEqual([{id: testFavoriteData.id, name: testFavoriteData.name}, {id: 2, name: 'test1'}, {id: 3, name: 'test2'}]);
        expect(response.body["page"]).toEqual(1);
        expect(response.body["search"]).toEqual("test");
    });

    it('get all favorites with page 2', async () => {
        const response = await request(app).get('/favorites?search=test&page=2');

        expect(response.status).toBe(200);
        expect(response.body["favorite"]).toEqual([]);
        expect(response.body["page"]).toEqual(2);
        expect(response.body["search"]).toEqual("test");
        expect(response.body["count"]).toEqual(3);
    });

    it('get all favorites with no page', async () => {
        const response = await request(app).get('/favorites?search=test');

        expect(response.status).toBe(200);
        expect(response.body["page"]).toEqual(1);
        expect(response.body["search"]).toEqual("test");
    });

    it('get all favorites with no search', async () => {
        const response = await request(app).get('/favorites?page=1');

        expect(response.status).toBe(200);
        expect(response.body["page"]).toEqual(1);
        expect(response.body["search"]).toEqual("");
    });

    it('get all favorites with no search and no page', async () => {
        const response = await request(app).get('/favorites');

        expect(response.status).toBe(200);
        expect(response.body["page"]).toEqual(1);
        expect(response.body["search"]).toEqual("");
    });
});

describe('test favorites get one function', function() {
    const favoriteId = testFavoriteData.id;
    it(`get one favorite by id with ${favoriteId}`, async () => {
        const response = await request(app).get('/favorites/' + favoriteId);

        expect(response.status).toBe(200);
        expect(response.body["favorite"].id).toEqual(favoriteId);
    });

    it(`get one faile when favorite no create`, async () => {
        const response = await request(app).get('/favorites/100');

        expect(response.status).toBe(404);
    });
});