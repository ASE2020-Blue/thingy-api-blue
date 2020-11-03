# https://hub.docker.com/r/nodered/node-red
# https://nodered.org/docs/getting-started/docker

# 1.2.2: Node Red version
# 12: Node.js version
##      This is the latest LTS available in node-red's tags
FROM nodered/node-red:1.2.2-12

# WORKDIR is /data

# Copy package.json to the WORKDIR so npm builds all
# of your added nodes modules for Node-RED
COPY ./node-red-notifier-data/package.json .
RUN yarn install