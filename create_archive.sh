#!/bin/bash

# strict mode
set -e

# version
version="$(npm pkg get version | sed 's/"//g')"
archive_name="dakara-client-web_$version.zip"

# make production build
echo "Creating build, please wait..."
npm run build

cd dist

# archive the dist folder
zip -r "../$archive_name" static

echo "Archive created in $archive_name"
