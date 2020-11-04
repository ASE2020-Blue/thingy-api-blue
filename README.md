# thingy-api-blue

## Getting started

To run all services at once, you can go in the `dev` folder, and use the command

    docker-compose up --build

The build argument is necessary after manipulating any `Dockerfile` or when
changing elements on the `package.json` file of a service.

If the images are built, we can start the services without the `--build` argument.


### Run individual services
During development, the entier environment doesn't have to run to test out
part of the project.

When it is the case, you can specify which service of the `docker-compose.yml` file
you want to start

`docker-compose up --help`:
```txt
Usage: up [options] [--scale SERVICE=NUM...] [--] [SERVICE...]
```

For example: `docker-compose up backend` (which will also start the db, as it is declared as depended).


### Detach of `docker-compose up`
With the `-d`/`--detach` argument (_Detached mode: Run containers in the background, print new container names. Incompatible with `--abort-on-container-exit.`_), you can start the project without having to
have a busy terminal full of logs.

Then, to stop them, use `docker-compose down`


### Postgres storage
Postgres with store its data on a volume handled internally by Docker.
If you want to remove all its data, use `docker volume rm ase-blue-pgdata`.