'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/upload/local', controller.local.index); // 查询列表
  router.get('/upload/local/:id', controller.local.show); // 获取单个文件
  router.post('/upload/local/single', controller.local.single); // 上传单个文件
  router.post('/upload/local/multiple', controller.local.multiple); // 批量上传
  router.post('/upload/local/url', controller.local.url); // 通过网络地址获取图片并上传
  router.post('/upload/local/update/:id', controller.local.update); // 更新上传附件
  router.put('/upload/local/:id', controller.local.extra); // 编辑图片描述
  router.delete('/upload/local/:id', controller.local.destroy); // 编辑图片描述
};
