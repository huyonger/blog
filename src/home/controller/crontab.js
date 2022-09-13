const Base = require('./base');
const path = require('path');
const fetch = require('node-fetch');
const { think } = require('thinkjs');

const env = think.env;
module.exports = class extends Base {
    /**
     * sync comment num
     * @return {[type]} [description]
     */
    async sync_commentAction() {
        await this.service('comment', 'home').sync();
        this.success();
    }
    /**
     * sync baidu record
     * @return {[type]} [description]
     */
    async baiduAction() {
        if (env === 'development') {
            this.success();
        }
        const site_urls = ['https://www.imyoyo.xyz', 'https://imyoyo.xyz'];
        let postModel = this.model('post');
        let postList = await postModel.getPostSitemapList();
        for (let site_url of site_urls) {
            this.assign('postList', postList);
            this.assign('origin', site_url);
            const urls = await this.render(path.join(this.HOME_VIEW_PATH, 'url.txt'));
            await fetch(`http://data.zz.baidu.com/urls?site=${site_url}&token=Jw08Xa6tLYwwEa8l`, {
                method: 'POST',
                body: urls,
            })
                .then((data) => {
                    return data.json();
                })
                .then((data) => {
                    return data;
                });
        }
        this.success();
    }
};
