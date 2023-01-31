#!/bin/sh
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
docker-compose exec ipfs ipfs config Addresses.Swarm '["/ip4/0.0.0.0/tcp/4001", "/ip4/0.0.0.0/tcp/8081/ws", "/ip6/::/tcp/4001"]' --json
docker-compose exec ipfs ipfs config --bool Swarm.EnableHolePunching true
docker-compose exec ipfs ipfs config --bool Swarm.EnableAutoNATService true
docker-compose exec ipfs ipfs config --bool Swarm.RelayClient.Enabled true
