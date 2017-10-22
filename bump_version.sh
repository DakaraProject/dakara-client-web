#!/bin/bash

if [[ -z $1 ]]
then
    >&2 echo 'Error: no version specified'
    exit 1
fi

version_number=$1
version_date=$(date -I -u)

npm version $version_number --no-git-tag-version

sed -i "/^## Unreleased$/a \\
\\
## $version_number - $version_date" CHANGELOG.md 

echo "Version bumped to $version_number"

