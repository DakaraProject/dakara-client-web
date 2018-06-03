#!/bin/bash

set -e

if [[ -z $1 ]]
then
    >&2 echo 'Error: no version specified'
    exit 1
fi

version_number=$1
version_date=$(date -I -u)

npm version $version_number --no-git-tag-version

changelog_file=CHANGELOG.md
sed -i "/^## Unreleased$/a \\
\\
## $version_number - $version_date" $changelog_file

git add package.json $changelog_file
git commit -m "Version $version_number"
git tag $version_number

echo "Version bumped to $version_number"
