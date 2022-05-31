'use strict';

const await = require("await-stream-ready/lib/await");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('attachment', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      filename: {
        type: Sequelize.STRING(64),
        allowNull: false,
        comment: '文件名',
      },
      extname: {
        type: Sequelize.STRING(8),
        allowNull: false,
        comment: '扩展名',
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '访问网址',
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '存贮位置',
      },
      extra: {
        type: Sequelize.STRING,
        comment: '额外信息',
      },
      createdAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('attachment')
  },
};
