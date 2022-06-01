const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const moment = require('moment');

module.exports = {
  /**
   * 字符串转数字
   *
   * @param {*} str 字符串
   * @return {*} number
   */
  toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return null;
    return parseInt(str, 10) || 0;
  },
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
   * 组装附件属性
   *
   * @param {*} fullname 文件名或url
   * @param {*} attachment 附件记录对象
   * @param {*} config 全局配置信息
   * @param {string} [subPath=''] 子路径，可选
   */
  initAttachmentInfo: async (fullname, attachment, config, subPath = '/') => {
    if (subPath?.includes('..')) {
      // 不允许通过../对目录进行遍历
      throw new Error('上传路径非法');
    }
    // 文件名称
    const filename = path.basename(fullname);
    // 文件扩展名称
    const extname = path.extname(fullname).toLowerCase();
    // 预览地址
    let baseUrl = config.uploadBaseUrl || '/uploads';
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }
    let realSubPath = subPath;
    if (subPath) {
      if (!realSubPath.startsWith('/')) {
        realSubPath = '/' + realSubPath;
      }
      if (!realSubPath.endsWith('/')) {
        realSubPath += '/';
      }
    }
    const realBaseUrl = `${baseUrl}${realSubPath}`;
    // 上传位置
    const basePath = config.uploadBaseDir || `${config.baseDir}/app/public/uploads`;
    const targetPath = path.join(basePath, realSubPath);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // 组装参数 model
    attachment.extname = extname;
    attachment.filename = filename;
    attachment.url = `${realBaseUrl}${attachment.id}${extname}`;
    attachment.path = path.join(targetPath, `${attachment.id}${extname}`);
    attachment.subPath = realSubPath;
  },
  /**
   * 上传单个文件或片段
   *
   * @param {*} stream 文件流
   * @param {*} target 保存位置
   */
  uploadSingle: async (stream, target) => {
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
  },
};
