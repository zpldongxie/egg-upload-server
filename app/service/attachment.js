/*
 * @description: 上传附件
 * @author: zpl
 * @Date: 2022-05-31 14:12:09
 * @LastEditTime: 2022-06-01 11:16:49
 * @LastEditors: zpl
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;

class AttachmentService extends Service {
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
}

module.exports = AttachmentService;
