# NAQM

**NAQM**.

## Getting Started

```
clone the project
cd project-directory
yarn install
yarn dev
```

## Usage

### package.json

```
{
    "name": "naqm",
    "version": "2.0",
    "description": "NUST Air Quality Monitoring",
    "main": "index.js",
    "scripts": {
      "dev": "export NODE_ENV=development && echo 'Node environment set to development' && nodemon index.js && exit 0",
      "start": "(pm2 stop 'naqm' || echo 'Nothing to kill') && pm2 start index.js --name 'naqm'",
    },
    "keywords": [
      "Node",
      "Skeleton",
      "ES6"
    ],
    "author": "praemineo",
    "license": "MIT",
  }
```

## Directory Structure

- _Root_

  - **index.js** -
    Starting point for app execution.

  - **init.js** -
    Initialization sequences which executes once while app starts.

  - **initServer.js** -
    This is called from **init.js**, it loads the config and initializes the server based on it.

  - **initScript.sh** - Shell Script.

    - Deletes the existing _git_ repo
    - Initializes new _git_ repo
    - Creates the _logs_ directory
    - Triggers **NPM install**
    - Creates a fresh _.gitignore_

  - **routes.js** - main _router_ file, called and mounted from _init.js_.
    - this where all the _sub-routers_ from app are mounted on.
    - this will also contains the _404_ not-found middle-ware and also the _500_ server error middle-ware

* _config_

  - **app.json** - Main config file for the app.

    ```
    {
       "development": { //NODE_ENV
         "server": {   //Server Setting
           "port": 4444, // the Port Number
           "protocol": "http", // the Protocol
           "socket": true // enable Socket ?
         },
         "db": { // DataBase
             "host": "localhost", // DB Host
             "port": 27017, // DB port
             "database": "mongoDB" // DB type
             }
         }
     }
    ```

  - **bunyan.js** - Initializes the the BunyanJS, Exports the Logger.

  - **error.js** - Common Errors Config, Exports getError function.

    - getError
      - input - errorSting, data
      - returns - the errorObject.

  - **helper.js** - Processes _NODE_ENV_ and logs info or error.

  - **index.js** - calls, helper.js, bunyan.js and app.json and returns logger.

- **ssl** the directory in which all the ssl files and certificates.

- app
  This will contain all the code from the users.

  - _Sample user created module._
  - **module_name**
    - **router.js** - all the routes related to the module.
    - **crud.js** - the _CRUD_ for the module.
    - **middleware.js** - the middleware to be used in the module.
    - **schema.js**
    - **validator.js**

- **eslint.rc** - eslint configuration file.
  - constains basic configuration and rules for linting.
  - update this file to add specific rules for your project
