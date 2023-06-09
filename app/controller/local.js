/*
 * @description: 本地上传
 * @author: zpl
 * @Date: 2022-05-31 11:06:37
 * @LastEditTime: 2022-06-01 16:38:50
 * @LastEditors: zpl
 */
'use strict';

const Controller = require('egg').Controller;
const download = require('image-downloader');

class LocalController extends Controller {
  /**
   * 查询列表，支持排序分页和按名称模糊查询
   *
   * @memberof LocalController
   */
  async index() {
    const { ctx } = this;
    const { query, service } = ctx;
    const res = await service.attachment.index(query);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  /**
   * 获取单个文件
   *
   * @memberof LocalController
   */
  async show() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const res = await service.attachment.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * 上传单个文件
   *
   * @memberof LocalController
   */
  async single() {
    const { ctx, service, config } = this;
    const { helper, query } = ctx;
    const { path } = query;
    const stream = await ctx.getFileStream();
    const attachment = new ctx.model.Attachment();
    // 组装上传记录信息
    await helper.initAttachmentInfo(stream.filename, attachment, config, path);
    // 上传单个文件
    await helper.uploadSingle(stream, attachment.path);
    // 调用 Service 进行业务处理
    const res = await service.attachment.create(attachment.dataValues);
    // 设置响应内容和响应状态码
    helper.success({ ctx, res });
  }

  /**
   * 批量上传
   *
   * @memberof LocalController
   */
  async multiple() {
    const { ctx, service, config } = this;
    const { helper, query } = ctx;
    const { path } = query;
    const parts = ctx.multipart();
    const res = { _ids: [] };

    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        // 表单filed 不做处理
      } else {
        if (!part.filename) {
          ctx.throw(400, '未选择文件');
        }
        const attachment = new ctx.model.Attachment();
        // 组装上传记录信息
        await helper.initAttachmentInfo(part.filename, attachment, config, path);
        // 上传单个文件
        await helper.uploadSingle(part, attachment.path);
        // 调用 Service 进行业务处理
        await service.attachment.create(attachment.dataValues);
        res._ids.push(`${attachment.id}`);
      }
    }
    // 设置响应内容和响应状态码
    helper.success({ ctx, res });
  }

  /**
   * 通过网络地址获取图片并上传
   *
   * @memberof LocalController
   */
  async url() {
    const { ctx, service, config } = this;
    const { helper, query } = ctx;
    const { path } = query;
    const { name, url } = ctx.request.body;
    const attachment = new ctx.model.Attachment();
    // 组装上传记录信息
    await helper.initAttachmentInfo(name || url, attachment, config, path);
    // 使用image-downloader上传
    const options = {
      url,
      dest: attachment.path,
    };
    await download.image(options);
    // 调用 Service 进行业务处理
    const res = await service.attachment.create(attachment.dataValues);
    // 设置响应内容和响应状态码
    helper.success({ ctx, res });
  }

  /**
   * 更新上传附件
   *
   * @memberof LocalController
   */
  async update() {
    const { ctx, service, config } = this;
    const { helper, params, query } = ctx;
    const { path } = query;
    // 调用Service 删除旧文件，如果存在
    const attachment = await service.attachment.updatePre(params.id);
    // 获取用户上传的替换文件
    const stream = await ctx.getFileStream();
    // 组装上传记录信息
    await helper.initAttachmentInfo(stream.filename, attachment, config, path);
    // 上传单个文件
    await helper.uploadSingle(stream, attachment.path);
    // 调用 Service 进行业务处理
    const { id, ...info } = attachment.dataValues;
    const res = await service.attachment.update(id, info);
    helper.success({ ctx, res });
  }

  /**
   * 编辑图片描述
   *
   * @memberof LocalController
   */
  async extra() {
    const { ctx, service } = this;
    const {
      params,
      request: { body },
    } = ctx;
    const { id } = params;
    const { extra } = body;
    const res = await service.attachment.update(id, { extra });
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * 删除单个
   *
   * @memberof LocalController
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.attachment.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = LocalController;
