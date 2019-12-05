# Dakara web client

Web client for the Dakara project.

### Installation

To install Dakara completely, you have to get all the parts of the project.
Installation guidelines are provided over here:

* [Dakara server](https://github.com/Nadeflore/dakara-server/);
* [Dakara player VLC](https://github.com/Nadeflore/dakara-player-vlc/).

#### System requirements

* [NodeJS](https://nodejs.org/), to transpile the sources.

On Linux, the NodeJS provided by your system may be out to date.
It is advised to install the latest version with [nvm](http://nvm.sh/).

#### Node dependencies

Install dependencies, at root level of the repo:

```shell
npm install
```

### Running developement server 

```shell
npm start
```

This runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Building for production

```shell
npm run build
```

This builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.
