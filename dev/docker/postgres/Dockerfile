# https://hub.docker.com/_/postgres
FROM postgres:12-alpine

COPY docker-healthcheck /usr/local/bin/
# COPY *.sql /docker-entrypoint-initdb.d/

HEALTHCHECK CMD ["docker-healthcheck"]