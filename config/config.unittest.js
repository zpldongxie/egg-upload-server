/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.sequelize = {
    datasources: [
      {
        dialect: 'mysql',
        host: '127.0.0.1',
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

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // uploadBaseDir: '/uploads',
    // uploadBaseUrl: '/uploads'
  };

  return {
    ...config,
    ...userConfig,
  };
};
