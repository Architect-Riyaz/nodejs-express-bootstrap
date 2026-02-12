docker-compose -f ./deploy/docker-compose.yml build
docker save -o /tmp/api.tar api
docker save -o /tmp/mongo.tar mongo
