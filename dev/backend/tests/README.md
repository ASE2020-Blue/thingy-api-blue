# Tests in docker container
Using [Jest](https://jestjs.io/) library.

To run the tests for the backend:

```shell
# https://stackoverflow.com/a/43267603/3771148
set -a # automatically export all variables
source ../.env
set +a
yarn run test
```

## Issue
At the moment, the tests are run sequentially as they will lean on Sqlite local file.
This is done through running `yarn run db:migrate` and `yarn run db:seed:all` with child process
in the before all clause.

This was done to avoid having to use a postgres service for testing (avoiding docker).

### Improvements
To run the tests with in memory sqlite, we would have to share the connection to the in memory
database between the migrations/seeds, we would have to:
1. start the app, for Sequelize to initiate a connection with the [in-memory db](https://sqlite.org/inmemorydb.html)
    * [with storage set to :memory:](https://sequelize.org/master/manual/dialect-specific-things.html#sqlite)
2. pass the sequelize instance to `Umzup` to migrate/seed
    * Umzug is the underlaying layer of Sequelize for migrating and seeding a db.
    * See example on [its github page](https://github.com/sequelize/umzug)
