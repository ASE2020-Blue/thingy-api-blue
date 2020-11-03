# Stay consistent with node red's node.js version
FROM node:12-alpine

RUN mkdir /root/.bin
COPY ./docker/backend/wait-for-postgres.sh /root/.bin

# Install the dependencies
RUN apk add --no-cache postgresql

RUN mkdir /root/app
WORKDIR /root/app

COPY ./backend/package.json /root/app
RUN npm install -g nodemon

RUN yarn install

VOLUME [ "/root/app" ]

# Wait for postgres expect the host of the postgres service.
# The remaining arguments will be what is executed when postgres is ready
CMD [ "/root/.bin/wait-for-postgres.sh", "postgres", \
        "yarn", "run", "start"]