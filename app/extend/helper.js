const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const moment = require('moment');

module.exports = {
  /**
   * 格式化时间
   *
   * @param {*} time
   */
  formatTime: time => moment(time).format('YYYY-MM-DD HH:mm:ss'),
  /**
   * 处理成功响应
   *
   * @param {*} { ctx, res = null, msg = '请求成功' }
   */
  success: ({ ctx, res = null, msg = '请求成功' }) => {
    ctx.body = {
      errCode: 0,
      data: res,
      msg,
    };
    ctx.status = 200;
  },
  /**
   * 上传单个文件
   *
   * @param {*} stream 文件流
   * @param {*} attachment 附件记录对象
   * @param {*} config 全局配置信息
   * @return {*} 上传完成后返回附件记录信息，用于入库等后续操作
   */
  uploadSingle: async (stream, attachment, config) => {
    const filename = path.basename(stream.filename); // 文件名称
    const extname = path.extname(stream.filename).toLowerCase(); // 文件扩展名称
    // 组装参数 model
    attachment.extname = extname;
    attachment.filename = filename;
    const baseUrl = config.uploadBaseUrl || '/uploads';
    attachment.url = new URL(`${baseUrl}/${attachment.id}${extname}`).href;
    const basePath = config.uploadBaseDir || `${config.baseDir}/app/public/uploads`;
    const target = path.join(basePath, `${attachment.id}${attachment.extname}`);
    attachment.path = target;
    // 组装参数 stream
    const writeStream = fs.createWriteStream(target);
    // 文件处理，上传到云存储等等
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
    return attachment.dataValues;
  },
};
