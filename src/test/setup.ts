import myDataSource from "../dataSource"

const connection = {
    async connect() {
        await myDataSource.initialize();
    },

    async close() {
        await myDataSource.destroy();
    }
}

beforeAll(async ()=>{
    await connection.connect();
});


afterAll(async ()=>{
    await connection.close();
});