/*
 * @description: 本地上传
 * @author: zpl
 * @Date: 2022-05-31 11:06:37
 * @LastEditTime: 2022-06-01 09:03:37
 * @LastEditors: zpl
 */
'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const download = require('image-downloader')

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

  /**
   * 通过网络地址获取图片并上传
   *
   * @memberof LocalController
   */
  async url() {
    const { ctx, service, config } = this
    const { name, url } = ctx.request.body
    const attachment = new ctx.model.Attachment();

    const filename = path.basename(name || url); // 文件名称
    const extname = path.extname(name || url).toLowerCase(); // 文件扩展名称

    // 组装参数 model
    attachment.extname = extname;
    attachment.filename = filename;
    const baseUrl = config.uploadBaseUrl || '/uploads';
    attachment.url = new URL(`${baseUrl}/${attachment.id}${extname}`).href;
    const basePath = config.uploadBaseDir || `${config.baseDir}/app/public/uploads`;
    const target = path.join(basePath, `${attachment.id}${attachment.extname}`);
    attachment.path = target;

    // 使用image-downloader上传
    const options = {
      url: url,
      dest: target
    }
    await download.image(options)

    // 入库
    const res = await service.attachment.create(attachment.dataValues)

    ctx.helper.success({ctx, res})
  }
}

module.exports = LocalController;
