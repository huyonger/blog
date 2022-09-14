const Base = require('./base');
const fetch = require('node-fetch');
const https = require('https');
// 忽略HTTPS证书验证
const agentOptions = {
    agent: new https.Agent({ rejectUnauthorized: false }),
};
const isDev = think.env === 'development';
module.exports = class extends Base {
    async pingAction() {
        const options = await this.model('options').getOptions();
        const pingback = JSON.parse(options.pingback);
        const data = this.post();
        const params = [];

        let timeoutPromise = async (timeout) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('');
                }, timeout);
            });
        };

        //1.提取url链接
        // eslint-disable-next-line no-useless-escape
        const urls = (data.markdown_content.match(/.\[.*?\]\((.*?)\)/gms) || [])
            .filter((url) => {
                return !url.startsWith('!');
            })
            .map((url) => {
                return url.replace(/.*\[.*\]\((.*)\)/gms, '$1');
            });
        //2.获取url对应pingback server
        for (let i = 0; i < urls.length; i++) {
            if (urls[i].endsWith('?pingback=true')) {
                continue;
            }
            const pingbackServer = await Promise.race([
                timeoutPromise(3000),
                fetch(urls[i], agentOptions)
                    .then((res) => {
                        return res.headers.get('X-Pingback') || '';
                    })
                    .catch((err) => {
                        this.fail('pingback exist or error');
                    }),
            ]);
            if (pingbackServer !== '') {
                params.push({
                    pagelinkedfrom: `${this.ctx.request.origin}/post/${data.pathname}.html`,
                    pagelinkedto: urls[i],
                    pingbackServer: pingbackServer,
                });
            }
        }
        //3.通过本地pingback client 调用 远程pingback server
        let isPingback = false;
        for (let i = 0; i < params.length; i++) {
            const res = await fetch(isDev ? 'http://127.0.0.1:8361' : pingback.client, {
                method: 'POST',
                body: JSON.stringify(params[i]),
            }).then((res) => {
                if (res.status === 200) {
                    return 'success';
                }
                return 'fail';
            });
            if (res === 'success') {
                data.markdown_content = data.markdown_content.replace(
                    params[i].pagelinkedto,
                    params[i].pagelinkedto + '?pingback=true',
                );
                isPingback = true;
            }
        }
        if (isPingback) {
            return this.success(data.markdown_content);
        }
        return this.fail('pingback exist or error');
    }

    // async backAction(){
    //     return this.success()
    // }
};
