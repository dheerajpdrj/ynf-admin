#!/usr/bin/env bash
set -x

if [ "$1" == "dev" ]; then
    target_dir="/var/www/html/ynf/app/admin/"
else
    target_dir="/var/www/html/ynf/app/admin/"
fi

# Create the target directory if it doesn't exist
mkdir -p "$target_dir"

# Copy files to the target directory
cp -R build/* "$target_dir"
