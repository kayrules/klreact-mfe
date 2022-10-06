# Micro-Frontend boilerplate - klreact-mfe

## Starting all services
```
yarn install
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
yarn install
yarn build:all
```

## Running local build files from ./dist
```
npx serve ./dist
open http://localhost:3000
```