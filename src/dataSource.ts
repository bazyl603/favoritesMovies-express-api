import { DataSource, DataSourceOptions } from "typeorm";

let prepareDataSource: DataSourceOptions | undefined;

switch(process.env.NODE_ENV){
    case 'development':
        prepareDataSource = {
            type: 'sqlite',
            database: './db.sqlite',
            entities: ["src/entity/*.ts"],
            synchronize: true,
        }
      break;
    case 'production':
        prepareDataSource = {
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ["src/entity/*.js"],
            logging: false,
            synchronize: false,
        }
      break;
    case 'test':
      break;
  }

  let myDataSource: DataSource | undefined;
if(prepareDataSource){
    myDataSource = new DataSource(prepareDataSource);    
}

export default myDataSource;