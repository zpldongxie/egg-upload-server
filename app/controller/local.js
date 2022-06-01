/*
 * @description: 本地上传
 * @author: zpl
 * @Date: 2022-05-31 11:06:37
 * @LastEditTime: 2022-06-01 08:38:54
 * @LastEditors: zpl
 */
'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class LocalController extends Controller {
  /**
   * 上传单个文件
   *
   * @memberof LocalController
   */
  async single() {
    const { ctx, service, config } = this;
    const { helper } = ctx;
    const stream = await ctx.getFileStream();
    const attachment = new ctx.model.Attachment();
    // 上传单个文件
    const attInfo = await helper.uploadSingle(stream, attachment, config);
    // 调用 Service 进行业务处理
    const res = await service.attachment.create(attInfo);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * 批量上传
   *
   * @memberof LocalController
   */
  async multiple() {
    const { ctx, service, config } = this;
    const { helper } = ctx;
    const parts = ctx.multipart();
    const res = { _ids: [] };

    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        // 表单filed 不做处理
      } else {
        if (!part.filename) {
          throw new Error('未选择文件');
        }
        const attachment = new ctx.model.Attachment();
        // 上传单个文件
        const attInfo = await helper.uploadSingle(part, attachment, config);
        // 调用 Service 进行业务处理
        await service.attachment.create(attInfo);
        res._ids.push(`${attachment.id}`);
      }
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = LocalController;
