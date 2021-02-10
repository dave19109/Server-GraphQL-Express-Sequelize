# Server-GraphQL-Express-Sequelize
This is a basic structure for a web server with Graphql APIs.

## Packages
The packages it uses are as follows:
- Node js
- GraphQL
- Express
- Sequelize
- Mysql2
- Typescript

I also use Webpack5 and Babel as a bundler of modules and is based on JWT authentication.

## Usage
### Intial
``` 
npm install
```
Configure environment variables
```
export NODE_ENV=development
export JWT_SECRET=xxxxxxxxx
```
Configure database access data in the file src/configs/database.json
```
{
  "development": {
    "username": "xxxx",
    "password": "xxxxx",
    "database": "xxxx",
    "port": 8889,
    "host": "localhost",
    "dialect": "mysql",
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  },
  "production": {
    "username": "xxxx",
    "password": "xxxx",
    "database": "xxxx",
    "port": 3307,
    "host": "localhost",
    "dialect": "mysql",
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  }
}

```
### RUN DEV
The server is listening on port 80.

```
npm run start
```

## Build
For server bundle build

```
npm run build
```
### RUN PRODUCTION
To launch the server in production mode

```
npm run build && npm run production
```

