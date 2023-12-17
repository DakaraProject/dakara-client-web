# Contributing

## Release

1. Move to the `develop` branch and pull.
   ```sh
   git checkout develop
   git pull
   ```
   If there are cosmetic modifications to perform on the changelog file, do it now.
2. Call the bump version script:
   ```sh
   ./bump_version.sh 0.0.0 0.1.0
   ```
   with `0.0.0` the release version number and `0.1.0` the next version (without 'v', without '-dev').
3. Push the version commit and its tag:
   ```sh
   git push
   git push origin 0.0.0
```
   with the according version number.
4. Move to the `master` branch and merge created tag into it.
   Then push.
   ```sh
   git checkout master
   git pull
   git merge 0.0.0
   git push
   ```
5. Before building the JavaScript bundle, make sure dependencies are up to date:
   ```sh
   npm install
   ```
6. Call the script to create the archive:
   ```sh
   ./create_archive.sh 0.0.0
   ```
   with the according version number.
7. On GitHub, draft a new release, set the version number with the created tag ("Existing tag" should read).
   Set the release title with "Version 0.0.0" (with number, you get it?).
   Copy-paste corresponding section of the changelog file in the release description.
   Add the created archive file.
   You can now publish the release.
