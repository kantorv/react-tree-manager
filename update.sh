#!/bin/bash

# Initialize the version type variable
version_type=""

# Parse command line arguments
while getopts "pmj" opt; do
  case $opt in
    p)
      version_type="patch"
      ;;
    m)
      version_type="minor"
      ;;
    j)
      version_type="major"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# If no valid flag was provided, display a usage message
if [ -z "$version_type" ]; then
  echo "Usage: $0 -p (Patch) | -m (Minor) | -j (maJor)"
  exit 1
fi

# Install dependencies and build the project
yarn install
yarn build

# Update version based on the selected flag
yarn version --$version_type

# Publish the package to npm
npm publish
