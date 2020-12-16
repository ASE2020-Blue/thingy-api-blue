# Stay consistent with node red's node.js version
FROM node:12-alpine as builder

# This dockerfile is here to build the frontend and mount in the appropriate
# folder for nginx

RUN mkdir /root/app
WORKDIR /root/app

COPY ./frontend /root/app

ENV VUE_APP_API_BASE_URL=https://thingy-blue.xyz/api

RUN yarn install
RUN yarn build

VOLUME [ "/root/app" ]

FROM nginx:1.18.0-alpine as production-build

ENV NODE_ENV=production

COPY --from=builder /root/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]