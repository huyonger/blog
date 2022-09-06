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
        let postModel = this.model('post');
        let postList = await postModel.getPostSitemapList();
        this.assign('postList', postList);
        this.assign('origin', this.ctx.request.origin);
        const urls = await this.render(path.join(this.HOME_VIEW_PATH, 'url.txt'));

        if (env === 'development') {
            this.success();
        }

        const response = await fetch(
            `http://data.zz.baidu.com/urls?site=${this.ctx.request.origin}&token=Jw08Xa6tLYwwEa8l`,
            {
                method: 'POST',
                body: urls,
            },
        );
        response
            .json()
            .then((data) => {
                this.success(data)
            })
    }
};
