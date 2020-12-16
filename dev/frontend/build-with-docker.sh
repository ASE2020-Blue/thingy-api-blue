#!/bin/sh

docker run --rm \
    --env-file ../.secrets.env \
    --env-file ../.env \
    -e VUE_APP_API_BASE_URL=https://thingy-blue.xyz/api \
    -e VUE_APP_ENABLE_SENTRY=true \
    --workdir /root/app \
    -v `pwd`:/root/app \
    node:12-alpine yarn run build