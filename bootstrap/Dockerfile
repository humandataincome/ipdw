FROM node:21-alpine

RUN apk add --no-cache g++ cmake make openssl openssl-dev openssl-libs-static git

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build:prod

ENTRYPOINT [ "npm", "run", "start:prod" ]

# USAGE EXAMPLE
# docker buildx build . --platform=linux/amd64 --tag=ipdw-bootstrap-node --progress=plain
# docker run --rm -p 4001:4001 ipdw-bootstrap-node
# docker run --rm -p 4001:4001 ipdw-bootstrap-node CAESQO8swgDBS6fc3/8o27ErvWERJG4e9+Fgts0YFgC665eWUkjOdH5aVa0bF0BqfrlVAVJwLydZMCdBKB4NqUajwis=
