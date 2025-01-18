# WordChainService

# configure debug env TS-JS-node.js-vscode
# https://www.youtube.com/watch?app=desktop&v=JdvkaW2xeiI&t=24s

# @various commands
# npm install -g npm-install-missing
# npm-install-missing
# npm install packageName --save



# npm init -y
# npm install typescript ts-node @types/node --save-dev
# npm install express
# npm install @types/express --save-dev
# npm install nodemon ts-node --save-dev //not used
# npx tsc --init
# edit tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
# add scripts to package.json
"scripts": {
  "start": "ts-node src/index.ts",
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "serve": "node dist/index.js"
}


# npm init -y
# npm i typescript
# npx tsc --init --sourceMap --rootDir src --outDir dist
# npm install express
# npm install @types/express --save-dev

    "build": "rimraf dist && npx index.ts",
    "start": "node dist/index.js"


###################################################
# CREDITS

# Express API how to
# https://medium.com/@holasoymalva/how-to-build-a-rest-api-with-node-js-and-typescript-3491ddd19f95

# VSCODE - TS - NODE --- setup debug
# https://www.youtube.com/watch?app=desktop&v=JdvkaW2xeiI&t=24s

# dockerize
# https://chinwendu.medium.com/how-to-dockerize-your-typescript-application-with-multi-stage-build-a-step-by-step-guide-56e7c4274088

# mongodb
# https://www.mongodb.com/resources/products/compatibilities/using-typescript-with-mongodb-tutorial

# kafka how to
https://github.com/maddymanu/TypeScript-KafkaJS-Example/blob/master/src/producer.ts

# DOCKER

https://docs.docker.com/guides/kafka/
docker-compose.exe up -d