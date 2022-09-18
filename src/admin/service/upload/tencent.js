const fs = require('fs');
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');
const Base = require('./base');

const readFileAsync = think.promisify(fs.readFile);
const statAsync = think.promisify(fs.stat);
module.exports = class extends Base {
    // 导入方法
    async uploadMethod(file, config) {
        const filename_abs = file.path;
        // eslint-disable-next-line no-unused-vars
        const { secretId, secretKey, bucket, region, origin, _, prefix } = config;
        // 创建实例
        const cos = new COS({
            SecretId: secretId,
            SecretKey: secretKey,
        });
        const putObjectAsync = think.promisify(cos.putObject, cos);
        let savePath = this.getSavePath(filename_abs, prefix);
        if (!path.extname(savePath)) {
            savePath += path.extname(file.name);
        }
        const fileData = await readFileAsync(filename_abs);
        const { size } = await statAsync(filename_abs);
        const { Location } = await putObjectAsync({
            Bucket: bucket,
            Region: region,
            Key: savePath,
            Body: fileData,
            ContentLength: size,
        });
        // result.Location
        return 'https://' + Location;
    }

    // 执行方法
    async run(file, config) {
        return await this.upload(file, config);
    }
};
