/*
 * @description: 上传附件表
 * @author: zpl
 * @Date: 2022-05-31 12:38:15
 * @LastEditTime: 2022-05-31 21:43:12
 * @LastEditors: zpl
 */
'use strict';

module.exports = app => {
  const { Sequelize, model } = app;
  const attributes = {
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
  };
  const options = {
    tableName: 'attachment',
    comment: '上传附件表',
    indexes: [],
    createdAt: 'createdAt',
    updatedAt: false
  };

  const Attachment = model.define('attachment', attributes, options);

  Attachment.prototype.toJSON = async function() {
    return {
      id: this.id,
      filename: this.filename,
      extname: this.extname,
      url: this.url,
      extra: this.extra,
      createdAt: this.createdAt
    };
  };

  return Attachment;
};
