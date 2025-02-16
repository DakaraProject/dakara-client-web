#!/bin/bash

# strict mode
set -e

# version
version="$(npm pkg get version | sed 's/"//g')"
archive_name="dakara-client-web_$version.zip"

# make production build
echo "Creating build, please wait..."
npm run build

# Go to build directory
cd build

# Move index.html and robots.txt to static dir
cp index.html robots.txt static

# archive the static folder
zip -r "../$archive_name" static

echo "Archive created in $archive_name"

