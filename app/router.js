'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/upload/local/single', controller.local.single);
  router.post('/upload/local/multiple', controller.local.multiple);
  router.post('/upload/local/url', controller.local.url);
  router.post('/upload/local/update/:id', controller.local.update)
  router.delete('/upload/local/:id', controller.local.destroy)
};
