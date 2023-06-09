/*
 * @description: 腾讯云上传
 * @author: zpl
 * @Date: 2022-07-29 16:49:20
 * @LastEditTime: 2022-07-29 18:02:22
 * @LastEditors: zpl
 */
'use strict';

const Controller = require('egg').Controller;
var COS = require('cos-nodejs-sdk-v5');

class TencentController extends Controller {
  constructor(props) {
    super(props);
    this.cos = new COS({
      SecretId: 'AKIDJRL2VjjU2JL7g06xZy84lErGSREl391e',
      SecretKey: 'ShhjY9WgfR1OuKVY1KPJ0SK0SgjY9e0B',
    });
  }

  async index() {
    const { ctx, cos } = this;
    const { helper } = ctx;
    const getService = async () => {
      return new Promise(resolve => {
        cos.getService((err, data) => {
          if (err) {
            ctx.throw(400, err);
          }
          const { statusCode, Owner, Buckets } = data;
          if (!`${statusCode}`.startsWith('2')) {
            ctx.throw(400);
          }
          const res = Buckets.map(b => b.Name);
          resolve(res);
        });
      });
    };
    const res = await getService();
    helper.success({ ctx, res });
  }
}

module.exports = TencentController;
