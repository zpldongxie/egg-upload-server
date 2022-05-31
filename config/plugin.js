'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },

  // 数据库
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
};
