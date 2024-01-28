# !/usr/bin/env bash

set -x

export CMD_PATH=$(cd `dirname $0`; pwd)
cd $CMD_PATH
git_version=$(git rev-parse --short HEAD)
apt-get update -y
apt-get install rsync -y
apt-cache search rsync
node -v
npm -v
# sed -i 's/=development/=production/g' .env
npm install
npm cache --force clean
npm run build
cd build/

# rsync -avz --no-perms --no-owner --no-group --progress ./ /var/www/html/ynf/app/admin
# sudo chmod -R a+rwx /var/www/html/warranty
# echo $git_version > /var/www/html/warranty
