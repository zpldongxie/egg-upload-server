/*
 * @description: 本地开发配置
 * @author: zpl
 * @Date: 2021-08-09 20:17:16
 * @LastEditTime: 2022-05-31 15:49:08
 * @LastEditors: zpl
 */
'use strict';

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // add your middleware config here
  config.middleware = ['errorHandler', 'customLogger'];

  config.sequelize = {
    datasources: [
      {
        dialect: 'mysql',
        host: '49.233.193.39',
        port: 3306,
        username: 'root',
        password: 'Clouddeep@8890',
        database: 'ysp_uploads',
        timezone: '+08:00',
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_general_ci',
        },
      },
    ],
  };

  // add your user config here reference
  const userConfig = {
    uploadBaseDir: 'F:/uploads',
    uploadBaseUrl: 'http://127.0.0.1:7001/uploads'
  };

  return {
    ...config,
    ...userConfig,
  };
};
