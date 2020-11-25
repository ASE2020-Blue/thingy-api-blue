# Stay consistent with node red's node.js version
FROM node:12-alpine

RUN mkdir /root/app
WORKDIR /root/app

COPY ./frontend/package.json /root/app
RUN yarn install

VOLUME [ "/root/app" ]

CMD ["yarn", "run", "serve"]