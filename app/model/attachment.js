/*
 * @description: 上传附件表
 * @author: zpl
 * @Date: 2022-05-31 12:38:15
 * @LastEditTime: 2022-06-01 18:05:12
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
      comment: '保存绝对位置',
    },
    subPath: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '/',
      comment: '保存相对位置，用于支持按目录层级查找',
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
    updatedAt: false,
  };

  const Attachment = model.define('attachment', attributes, options);

  Attachment.prototype.toJSON = function () {
    return {
      id: this.id,
      filename: this.filename,
      extname: this.extname,
      url: this.url,
      subPath: this.subPath,
      extra: this.extra,
      createdAt: this.createdAt,
    };
  };

  return Attachment;
};
