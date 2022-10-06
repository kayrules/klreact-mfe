# Micro-Frontend Demo for klreact-mfe (2022)

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