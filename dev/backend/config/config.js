module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": "postgres",
    "dialect": "postgres"
  },
  "test": {
    "dialect": "sqlite",
    "storage": "./database.sqlite3"
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": "postgres",
    "dialect": "postgres"
  }
};
