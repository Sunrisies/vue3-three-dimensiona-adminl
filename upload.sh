#!/bin/bash
node -v 
yarn build
# 执行 scp 命令
scp -r /Users/zhuzhongqian/Desktop/cesium+vue3+ts/my-vue-app/dist root@123.249.75.75:/www/wwwroot/chaoyangqq.co/cesium

# # 执行 ssh 命令
# ssh root@123.249.75.75 'cd /www/wwwroot/chaoyangqq.co/shopvidi-nuxt2 && sh start.sh'