const path = require('path');
const pack = require('../../../package.json');

const isPkg = think.env === 'pkg';
const isDev = think.env === 'development';
module.exports = class extends think.Controller {
    constructor(...args) {
        super(...args);
        //home view path
        this.HOME_VIEW_PATH = path.join(think.ROOT_PATH, 'view', 'home');
    }
    /**
     * some base method in here
     */
    async __before() {
        if (this.ctx.action === 'install') {
            return;
        }
        if (!firekylin.isInstalled) {
            return this.redirect('/index/install');
        }

        let model = this.model('options');
        let options = await model.getOptions();
        this.options = options;
        let { navigation, themeConfig, preview_url } = options;

        // 非cdn preview url
        let referrer = this.ctx.request.origin;
        if (referrer === preview_url && !isDev) {
            let userInfo = (await this.session('userInfo')) || {};
            if (think.isEmpty(userInfo)) {
                return this.redirect('/admin/login');
            }
            this.userInfo = userInfo;
            if (!this.isAjax()) {
                this.assign('userInfo', { id: userInfo.id, name: userInfo.name, type: userInfo.type });
            }
        }
        try {
            navigation = JSON.parse(navigation);
        } catch (e) {
            navigation = [];
        }
        try {
            themeConfig = JSON.parse(themeConfig);
        } catch (e) {
            themeConfig = {};
        }

        //remove github pwd
        let commentConfigName = {};
        try {
            commentConfigName = JSON.parse(options.comment.name);
            delete commentConfigName.githubPassWord;
            options.comment.name = JSON.stringify(commentConfigName);
        } catch (e) {
            commentConfigName = {};
        }

        this.assign('options', options);
        this.assign('navigation', navigation);
        this.assign('themeConfig', themeConfig);
        this.assign('VERSION', pack.version);
        //set theme view root path
        let theme = options.theme || 'firekylin';
        this.THEME_VIEW_PATH = path.join(isPkg ? process.cwd() : think.ROOT_PATH, 'www', 'theme', theme);

        //网站地址
        let siteUrl = this.options.site_url;
        if (!siteUrl) {
            siteUrl = 'http://' + this.ctx.host;
        }
        this.assign('site_url', siteUrl);

        //所有的分类
        let categories = await this.model('cate').getCateArchive();
        this.assign('categories', categories);

        // 所有标签
        let tagModel = this.model('tag');
        let tagList = await tagModel.getTagArchive();
        this.assign('tags', tagList);

        // 最近10条文章
        let postModel = this.model('post');
        let lastPostList = await postModel.getLastPostList();
        this.assign('lastPostList', lastPostList);

        this.assign('currentYear', new Date().getFullYear());
    }
    /**
     * display view page
     * @param  {} name []
     * @return {}      []
     */
    async displayView(name) {
        if (this.ctx.url.match(/\.json(?:\?|$)/)) {
            let jsonOutput = {},
                assignObj = this.assign();
            Object.keys(assignObj).forEach((key) => {
                if (['controller', 'http', 'config', '_', 'options'].indexOf(key) === -1) {
                    jsonOutput[key] = assignObj[key];
                }
            });

            this.ctx.type = 'application/json';
            this.ctx.body = jsonOutput;
            return true;
        }
        //判断localStorage是否存在js和css缓存
        if (this.cookie('v')) {
            this.assign('localStorage', true);
        } else {
            this.assign('localStorage', false);
        }
        return this.display(path.join(this.THEME_VIEW_PATH, name + '.html'));
    }
};
