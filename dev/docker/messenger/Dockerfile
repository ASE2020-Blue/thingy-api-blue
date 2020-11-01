# Stay consistent with node red's node.js version
FROM node:12-alpine

RUN mkdir /root/app
WORKDIR /root/app
VOLUME [ "/root/app" ]

COPY ./messenger-app/package.json /root/app
RUN yarn install

CMD ["yarn", "run", "start"]