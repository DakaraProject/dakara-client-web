# dakara-client-web
Dakara web client

## Install dependencies

Install Node JS, then in terminal:

```shell
sudo npm install -g gulp
npm install
```

The first command install Gulp at system level, which is required for transpilation. The second installs Gulp modules in the folder, so it must be entered in the repo folder.

To clone submodules (after cloning this repo):

```shell
git submodule update --init --recursive
```

# Gulp commands

Less to CSS transpilation:

```shell
gulp css
# or
gulp css-watch
```

The ```watch``` version doesn't close Gulp at the end, it waits for changes in Less files.

With ```--production``` option, compress the CSS file and add ```min``` suffix.

# Webpack

Install webpack globally

```shell
sudo npm install -g webpack
```

build js bundle

```shell
webpack
```

