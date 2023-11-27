import "dotenv/config"
import knex from "knex"

export class Knex 
{
    static create (options) {
        return knex(options)
    }

    static parseEnv () {
        return knex({
            client: process.env.DB_TYPE,
            connection: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_DATABASE,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD
            }
        })
    }
}
