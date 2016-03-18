# Dakara web client

Web client for the Dakara project.

### Installation

To install Dakara completely, you have to get all the parts of the project.
Installation guidelines are provided over here:

* [Dakara server](https://github.com/Nadeflore/dakara-server/);
* [Dakara player VLC](https://github.com/Nadeflore/dakara-player-vlc/).

#### Clone the submodules

Dakara web client relies on other projects not provided by any package manager:

* [Preboot](http://getpreboot.com/), a LESS framework.

You can clone the repo with its submodules in one command:

```shell
git clone --recursive git://github.com/Nadeflore/dakara-client-web.git
```

If you have cloned the repo alone, don't panic, you can still get the submodules after:

```shell
git submodule update --init --recursive
```

#### System requirements

* [NodeJS](https://nodejs.org/), to transpile the sources.

You need also some NodeJS modules installed at system level:

```shell
sudo npm install -g webpack
```

#### Node dependencies

Install dependencies, at root level of the repo:

```shell
npm install
```

### Running the stuff

To build JS bundle and transpile LESS into CSS:

```shell
webpack
```

The `-w` option doesn't close webpack at the end, it waits for changes in Less or js files.
