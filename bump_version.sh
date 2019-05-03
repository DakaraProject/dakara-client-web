#!/bin/bash

set -e

if [[ -z $1 ]]
then
    >&2 echo 'Error: no version specified'
    exit 1
fi

# next server version
if [[ -z $2 ]]
then
    >&2 echo 'Error: no next version specified'
    exit 1
fi

version_number=$1
dev_version_number=$2-dev
version_date=$(date -I -u)

npm version "$version_number" --no-git-tag-version

changelog_file=CHANGELOG.md
sed -i "/^## Unreleased$/a \\
\\
## $version_number - $version_date" $changelog_file

git add package.json package-lock.json $changelog_file
git commit -m "Version $version_number"
git tag "$version_number"

echo "Version bumped to $version_number"

# patch version file for dev version
npm version "$dev_version_number" --no-git-tag-version
# create commit
git add package.json package-lock.json
git commit -m "Dev version $dev_version_number" --no-verify

# say something
echo "Updated to dev version $dev_version_number"
