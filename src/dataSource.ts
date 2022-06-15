import { DataSource, DataSourceOptions } from "typeorm";

let prepareDataSource: DataSourceOptions = {
  type: 'sqlite',
  database: './db.sqlite',
  entities: ["src/entity/*.ts"],
  synchronize: true,
}

if(process.env.NODE_ENV === 'production') {
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
}


const myDataSource = new DataSource(prepareDataSource);

export default myDataSource;