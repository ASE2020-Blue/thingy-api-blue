# Stay consistent with node red's node.js version
FROM node:12-alpine as builder

RUN mkdir /root/app
WORKDIR /root/app

COPY ./frontend /root/app

RUN yarn install && yarn build

VOLUME [ "/root/app" ]

FROM nginx:1.18.0-alpine as production-build

COPY --from=builder /root/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]