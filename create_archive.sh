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
echo "Creating build, please wait..."
npm run build

# archive the dist folder
zip -r "$archive_name" dist

echo "Archive created in $archive_name"
