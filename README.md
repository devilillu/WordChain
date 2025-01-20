# WordChainService

1) Run docker compose, found in root folder of provided repo
# docker-compose up --build -d
2) Need to use http end point once, for kafka topic initialization
default @: http://localhost:8088/admin/init
3) Manually create database (name: "wordchain") in mongo-db with mongo-express, and add a collection (name: "dev")
default @: http://localhost:8081/

*kafka-ui also available for monitoring

Usage:
http://localhost:8081/chain/<startWord>/<endWord>