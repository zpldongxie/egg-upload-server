/*
 * @description: 上传附件
 * @author: zpl
 * @Date: 2022-05-31 14:12:09
 * @LastEditTime: 2022-06-01 15:25:40
 * @LastEditors: zpl
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;

class AttachmentService extends Service {
  /**
   * 查询单个
   *
   * @param {*} id
   * @return {*}
   * @memberof AttachmentService
   */
  async show(id) {
    const { ctx } = this;
    const { model } = ctx;
    const attachment = await model.Attachment.findOne({ where: { id } });
    if (!attachment) {
      this.ctx.throw(404, '未找到指定记录');
    }
    return attachment.toJSON();
  }

  /**
   * 查询列表，支持排序分页和按名称模糊查询
   *
   * @param {*} options
   * @memberof AttachmentService
   */
  async index(options) {
    const { app, ctx } = this;
    const {
      Sequelize: { Op },
    } = app;
    const { helper } = ctx;
    const attachmentKind = {
      image: ['.jpg', '.jpeg', '.png', '.gif'],
      document: [
        '.doc',
        '.docx',
        '.ppt',
        '.pptx',
        '.xls',
        '.xlsx',
        '.csv',
        '.key',
        '.numbers',
        '.pages',
        '.pdf',
        '.txt',
        '.psd',
        '.zip',
        '.gz',
        '.tgz',
        '.gzip',
      ],
      video: ['.mov', '.mp4', '.avi'],
      audio: ['.mp3', '.wma', '.wav', '.ogg', '.ape', '.acc'],
    };
    const { pageIndex, pageSize, sort, search, kind } = options;
    const pIndex = helper.toInt(pageIndex);
    const pSize = helper.toInt(pageSize);
    const params = {
      where: {},
      order: [],
    };
    // 按文件类型筛选
    if (search) {
      params.where.filename = { [Op.regexp]: search };
    }
    // 按文件类型筛选
    if (kind) {
      params.where.extname = { [Op.in]: attachmentKind[kind] };
    }
    // 排序
    if (sort) {
      const querySort = JSON.parse(sort);
      for (const key in querySort) {
        if (Object.hasOwnProperty.call(querySort, key)) {
          const value = querySort[key];
          params.order.push([key, value]);
        }
      }
    }
    params.order.push(['createdAt', 'asc']);
    // 分页
    if (pIndex !== null && pSize !== null) {
      params.limit = pSize;
      params.offset = (pIndex - 1) * pSize;
    }
    const { count, rows } = await ctx.model.Attachment.findAndCountAll(params);
    return {
      success: true,
      total: count,
      data: rows.map(row => row.toJSON()),
    };
  }

  /**
   * 新增
   *
   * @param {*} payload
   * @return {*}
   * @memberof AttachmentService
   */
  async create(payload) {
    const atta = await this.ctx.model.Attachment.create(payload);
    return atta.toJSON();
  }

  /**
   * 更新前置动作，若文件存在，先删除
   *
   * @param {*} id 记录id
   * @return {*}
   * @memberof AttachmentService
   */
  async updatePre(id) {
    const { ctx } = this;
    const { model } = ctx;
    const attachment = await model.Attachment.findOne({ where: { id } });
    if (!attachment) {
      ctx.throw(404, '未找到指定记录');
    } else {
      fs.unlinkSync(attachment.path);
    }
    return attachment;
  }

  /**
   * 更新上传记录
   *
   * @param {*} id 记录id
   * @param {*} info 更新信息
   * @return {*}
   * @memberof AttachmentService
   */
  async update(id, info) {
    const { ctx } = this;
    const { model } = ctx;
    const attachment = await model.Attachment.findOne({ where: { id } });
    if (!attachment) {
      ctx.throw(404, '未找到指定记录');
    }
    const atta = await attachment.update(info);
    return atta.toJSON();
  }

  /**
   * 删除
   *
   * @param {*} id
   * @memberof AttachmentService
   */
  async destroy(id) {
    const { ctx } = this;
    const { model } = ctx;
    const attachment = await model.Attachment.findOne({ where: { id } });
    if (!attachment) {
      ctx.throw(404, '未找到指定记录');
    } else {
      fs.unlinkSync(attachment.path);
    }
    await attachment.destroy();
  }
}

module.exports = AttachmentService;
