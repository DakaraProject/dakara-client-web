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

### Building the stuff

To build JS bundle and transpile LESS into CSS:

```shell
npx webpack
```

With the `-w` option, webpack does not close and waits for changes in LESS or JS files.

If you are using npm < 5.2.0, npx may be unavailable.
You can mimic its basic behavior with a shell function (Bash):

```bash
function npx {
    (PATH=$(npm bin):$PATH; eval $@;)
}
```
