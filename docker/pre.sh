#!/bin/sh

EMAIL=info@humandataincome.com
DOMAIN=ipfs.humandataincome.com,ipfs-api.humandataincome.com
BASIC_USERNAME=hudi
BASIC_PASSWORD=$(openssl rand -base64 32)

#rm -rf data

rm -f data/nginx/.htpasswd
mkdir -p data/nginx/
printf '%s:' "$BASIC_USERNAME" >> data/nginx/.htpasswd
openssl passwd -apr1 "$BASIC_PASSWORD" >> data/nginx/.htpasswd
echo "Login with $BASIC_USERNAME and $BASIC_PASSWORD"

docker-compose -f docker-compose.pre.yml down
export EMAIL=${EMAIL}
export DOMAIN=${DOMAIN}
docker-compose -f docker-compose.pre.yml up
