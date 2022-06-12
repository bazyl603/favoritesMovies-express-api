import 'reflect-metadata';
import myDataSource from './dataSource';
import env from 'dotenv';

env.config();

(async () => {  
    if(!process.env.NODE_ENV) {
        throw new Error('NODE_ENV is not defined');
    }
    if(!process.env.PORT) {
        throw new Error('PORT is not defined');
    }

    if(process.env.NODE_ENV === 'production') {
        if(!process.env.DB_HOST) {
            throw new Error('DB_HOST is not defined');
        }
        if(!process.env.DB_PORT) {
            throw new Error('DB_PORT is not defined');
        }
        if(!process.env.DB_USER) {
            throw new Error('DB_USER is not defined');
        }
        if(!process.env.DB_PASSWORD) {
            throw new Error('DB_PASSWORD is not defined');
        }
        if(!process.env.DB_NAME) {
            throw new Error('DB_NAME is not defined');
        }
    }

    if(!myDataSource){
        throw new Error('DataSource is not defined');
    }

    myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        console.log("===========================================================");
        console.log("NODE_ENV: " + process.env.NODE_ENV);
        console.log("===========================================================");
        console.log("PORT: " + process.env.PORT);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
})();