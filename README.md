# egg-uploader

基于egg实现的RESTful风格上传服务，支持本地上传、阿里云上传、七牛上传等

## 路由说明
- 本地上传统一以 `/upload/local`开头

## 初始化
- 建库
```bash
create database ysp_sso default character set utf8mb4 collate utf8mb4_bin;	
npm run init-db:prod
npm run init-data:prod
```