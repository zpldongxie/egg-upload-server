/*
 * @description: 上传附件
 * @author: zpl
 * @Date: 2022-05-31 14:12:09
 * @LastEditTime: 2022-05-31 16:59:04
 * @LastEditors: zpl
 */
'use strict';

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
    const att = await this.ctx.model.Attachment.create(payload);
    return att.toJSON();
  }
}

module.exports = AttachmentService;
