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


# Go to build directory
cd build

# Move index.html to static dir
mv index.html static

# archive the static folder
zip -r ../"$archive_name" static

echo "Archive created in $archive_name"

