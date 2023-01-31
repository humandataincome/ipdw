#!/bin/sh

EMAIL=info@humandataincome.com
DOMAIN=ipfs.humandataincome.com,ipfs-api.humandataincome.com
BASIC_USERNAME=hudi
BASIC_PASSWORD=$(openssl rand -base64 16)

#rm -rf data

rm -f data/nginx/.htpasswd
mkdir -p data/nginx/
printf '%s:' "$BASIC_USERNAME" >> data/nginx/.htpasswd
openssl passwd -apr1 "$BASIC_PASSWORD" >> data/nginx/.htpasswd
echo "Login with $BASIC_USERNAME and $BASIC_PASSWORD"

mkdir -p "data/certbot/conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "data/certbot/conf/options-ssl-nginx.conf"
openssl dhparam -out "data/certbot/conf/ssl-dhparams.pem" 2048

docker-compose -f docker-compose.pre.yml down
export EMAIL=${EMAIL}
export DOMAIN=${DOMAIN}
docker-compose -f docker-compose.pre.yml up
