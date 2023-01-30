#!/bin/sh

DOMAIN=ipfs.humandataincome.com
BASIC_USERNAME=hudi
BASIC_PASSWORD=dj3Wka9UCG

openssl req -x509 -nodes -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 \
    -subj "/C=GB/ST=London/L=London/O=ipfs/OU=IT Department/CN=${DOMAIN}"

rm .htpasswd
printf '%s:' "$BASIC_USERNAME" >> .htpasswd
openssl passwd -apr1 "$BASIC_PASSWORD" >> .htpasswd
echo "Login with $BASIC_USERNAME and $BASIC_PASSWORD"

docker-compose down
docker-compose up
# docker-compose up -d

# docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'
# docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'



docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["https://ipfs.humandataincome.com", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
