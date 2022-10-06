# Micro-Frontend Boilerplate: klreact-mfe
This source code was made available as part of for KLReact, 2022 demo by me. You may find the [presentation deck here](https://docs.google.com/presentation/d/1WsZWe_u0eMohvjNcSDEMJBL85wY6FqzKA1aPANg_B7E/edit?usp=sharing)

## Installing all packages
```
yarn install
```

## Starting all services
```
yarn start:all
```

## Starting selected service
```
yarn start:<service name>
eg:
yarn start:container
```

## Build all services for deployment
```
mv .env.example .env
yarn build:all
```

## Running local build files from ./dist
```
npx serve ./dist
open http://localhost:3000
```