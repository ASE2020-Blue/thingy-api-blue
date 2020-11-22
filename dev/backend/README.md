# Getting started

## Seed the db
Run the following command after bringing up the backend service:

    docker exec -it dev_backend_1 yarn run db:seed
    
    
## Run the tests
Run the following command from the `thingy-api-blue/dev` repository:

    docker-compose -f docker-compose.test.yml up --build backend-test

