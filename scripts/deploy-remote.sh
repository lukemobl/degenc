#! /bin/bash

pm2 stop 0
rm -rf /apps/degencups-io

mkdir temp
unzip /root/deploy.zip -d temp
cp -R /root/temp /apps/degencups-io

rm -rf /root/temp

npm i --prefix /apps/degencups-io
pm2 start 0
