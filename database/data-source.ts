import "dotenv/config";
import * as path from "node:path";

import { DataSource, type DataSourceOptions } from "typeorm";
// import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import type { SeederOptions } from "typeorm-extension";

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.APP_DB_PORT ?? "5432"),
  username: process.env.APP_DB_USERNAME,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME,
  // synchronize: true,
  // synchronize: process.env.NODE_ENV !== "production",

  entities: [path.join(__dirname, "../src/**/*.entity.{ts,js}")],
  seeds: [path.join(__dirname, "./seeds/**/*.seeder.{ts,js}")],
  migrations: [path.join(__dirname, "./migrations/**/*.{ts,js}")],
  // logging: process.env.NODE_ENV !== "production",
  // namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(dataSourceOptions);
