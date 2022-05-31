/*
 * @Author: lxw
 * @Date: 2022-01-13 12:11:20
 * @LastEditTime: 2022-02-07 16:50:42
 * @LastEditors: lxw
 * @Description:
 * @FilePath: \crp_service\app\middleware\custom_logger.js
 */
'use strict';

module.exports = () => {
  return async function customLogger(ctx, next) {
    const { method, url, body } = ctx.request;
    console.group('customLogger===========================Start');
    console.dir({
      host: ctx.host,
      url,
      method,
      // header: ctx.request.header,
      query: ctx.query,
      body,
    });
    console.groupEnd();
    console.log('customLogger===========================End');
    await next();
  };
};
