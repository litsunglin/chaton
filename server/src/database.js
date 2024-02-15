require('dotenv').config();
const { Client } = require('pg');

module.exports = {
    createDatabase: async function () {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            // Check if the 'discoon' database exists
            const dbExistsResult = await client.query(
                `SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
            );

            // If the 'discoon' database does not exist, create it
            if (dbExistsResult.rows.length === 0) {
                await client.query(`CREATE DATABASE '${process.env.DB_NAME}';`);
            } else {
                console.log('Database already exists');
            }

            // Connect to the 'discoon' database
            await client.end();
        } catch (err) {
            console.error('Error initializing database:', err.message);
        } finally {
            await client.end();
        }
    },

    removeTables: async function () {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();
            await client.query(`DROP TABLE tbl_user;`);
            console.log('Database tables are removed');
        } catch (err) {
            console.error('Error removing database:', err.message);
        } finally {
            await client.end();
        }
    },

    initializeTables: async function () {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            // Create the 'tbl_user' table
            await client.query(`
                CREATE TABLE IF NOT EXISTS tbl_user (
                uuid VARCHAR(37) NOT NULL UNIQUE,
                data JSONB NOT NULL);`);

            // Create the 'tbl_message' table
            await client.query(`
                CREATE TABLE IF NOT EXISTS tbl_message (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL);`);

            console.log('Database tables are ready');
        } catch (err) {
            console.error('Error initializing tables:', err.message);
        } finally {
            await client.end();
        }
    },

    getUser: async function (userId) {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            const result = await client.query(
                `SELECT * FROM tbl_user WHERE uuid = '${userId}';`
            );

            return result.rows[0];
        } catch (err) {
            console.error('Error getting user:', err.message);
        } finally {
            await client.end();
        }
    },

    getUserByName: async function (userName) {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            const result = await client.query(
                `SELECT * FROM tbl_user WHERE data ->> 'userName' = '${userName}';`
            );

            if(result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error getting user:', err.message);
        } finally {
            await client.end();
        }
    },

    getUsers: async function () {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            const result = await client.query(
                `SELECT * FROM tbl_user;`
            );

            return result.rows;
        } catch (err) {
            console.error('Error getting users:', err.message);
        } finally {
            await client.end();
        }
    },

    createUser: async function (user) {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            let userJSON = JSON.stringify(user);

            const result = await client.query(
                `INSERT INTO tbl_user (uuid, data) VALUES ('${user.userId}', '${userJSON}') RETURNING *;`
            );

            return result.rows[0];
        } catch (err) {
            console.error('Error creating user:', err.message);
        } finally {
            await client.end();
        }
    },

    insertMessage: async function (message) {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            let messageJSON = JSON.stringify(message);

            const result = await client.query(
                `INSERT INTO tbl_message (data) VALUES ('${messageJSON}') RETURNING *;`
            );

            return result.rows[0];
        } catch (err) {
            console.error('Error inserting message:', err.message);
        } finally {
            await client.end();
        }
    },

    getMessagesByReceivedUser: async function (userId) {
        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        try {
            await client.connect();

            const result = await client.query(
                `SELECT * FROM tbl_message WHERE (data ->> 'to' = $1 OR data ->> 'to' = '@all') AND data ->> 'from' != $1;`,
                [userId]
            );

            return result.rows;
        } catch (err) {
            console.error('Error getting messages:', err.message);
        } finally {
            await client.end();
        }
    },
};
