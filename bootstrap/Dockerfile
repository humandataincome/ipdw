FROM node:21-alpine

RUN apk add --no-cache g++ cmake make openssl openssl-dev openssl-libs-static git

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build:prod

# ENV DEBUG libp2p:*

ENTRYPOINT [ "npm", "run", "start:prod" ]

# BEFORE STARTING
# docker run -it --rm -v /home/bootstrap/letsencrypt/:/etc/letsencrypt/:rw -p 80:80 certbot/certbot certonly -d bootstrap.ipdw.tech --standalone --non-interactive --agree-tos --register-unsafely-without-email
# (crontab -l 2>/dev/null; echo "30 2 * * * docker run -it --rm -v /home/bootstrap/letsencrypt/:/etc/letsencrypt/:rw -p 80:80 certbot/certbot renew") | crontab -

# USAGE EXAMPLE
# docker buildx build . --platform=linux/amd64 --tag=ipdw-bootstrap-node --progress=plain
# docker run -d --rm -v /home/bootstrap/letsencrypt:/etc/ipdw/certificates:ro -p 4001:4001 -p 4002:4002 ipdw-bootstrap-node CAESQO8swgDBS6fc3/8o27ErvWERJG4e9+Fgts0YFgC665eWUkjOdH5aVa0bF0BqfrlVAVJwLydZMCdBKB4NqUajwis= /etc/ipdw/certificates/live/bootstrap.ipdw.tech/
