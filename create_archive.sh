#!/bin/bash

# strict mode
set -e

# version
if [[ -z $1 ]]
then
    >&2 echo 'Error: no version specified'
    exit 1
fi

version_number=$1
archive_name=dakara-client-web_$version_number.zip

# make production build
echo "Running Webpack, please wait..."
npx webpack -p

# the final directory must be 'static', so we create a symlink with this name
ln -s dist static

# archive the dist folder
zip -r "$archive_name" static

# remove the symlink
rm static

echo "Archive created in $archive_name"

