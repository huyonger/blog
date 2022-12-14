import React from 'react';
import { Row, Col, DatePicker, message } from 'antd';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { zip } from 'rxjs';
import pinyin from 'tiny-pinyin';

import ArticleHeader from './article-header/article-header';
import ArticleEditor from './article-editor/article-editor';
import ArticleControlHeader from './control-header/control-header';
import ArticleControlCategory from './control-category/control-category';
import ArticleControlTag from './control-tag/control-tag';
import ArticleControlPublic from './control-public/control-public';
import ArticleControlImage from './control-image/control-image';
import ArticleControlUser from './control-user/control-user';

import Checkbox from 'antd/lib/checkbox';
import { RadioChangeEvent } from 'antd/lib/radio';
import { ArticleProps, PreviewData } from './article.model';

import './article.less';
import { ArticleTypeEnum } from '../../enums/article-type.enum';
import ArticleControlTemplate from './control-template/control-template';
import { ArticleEnum } from './article.enum';

@inject('sharedStore', 'userStore', 'articleStore')
@observer
class Article extends React.Component<ArticleProps, {}> {
    static defaultProps: ArticleProps;
    type: ArticleTypeEnum;
    articleInfo = this.props.articleStore.articleInfo;

    state = {
        hasError: {
            pathname: false,
            title: false,
        },
        autocompletePathname: !this.props.match.params.id,
    };

    constructor(props: any) {
        super(props);
    }
    init() {
        const sharedStore = this.props.sharedStore;
        const userStore = this.props.userStore;
        const articleStore = this.props.articleStore;
        articleStore.setArticleInfo({ status: ArticleEnum.DRAFT });

        if (this.isPage()) {
            sharedStore.getTemplateList(window.SysConfig.options.theme || 'firekylin');
        }

        // Get Cats
        sharedStore.set$();
        const merged$ = zip(sharedStore.getCategoryList$, sharedStore.getDefaultCategory$);
        merged$.subscribe((res) => {
            sharedStore.setCategoryList(res[0].data);
            const defaultCategoryAry = res[0].data.filter((cat) => cat.id === +res[1].data);
            articleStore.setArticleInfo({ cate: defaultCategoryAry });
        });
        // Get Tags
        sharedStore.getTagList();
        // Get Users
        userStore.getUserList$().subscribe((res) => {
            userStore.setUserList(res.data);
            articleStore.setArticleInfo({
                user_id: userStore.userList.length > 0 ? userStore.userList[0].id : '',
            });
        });
    }
    // ???????????????
    isPage() {
        return this.type;
    }
    componentDidMount() {
        this.type = this.props.type;
        this.init();
        const id = +this.props.match.params.id;
        if (id) {
            this.props.articleStore.getArticleInfoById(id, this.type);
        } else {
            this.props.articleStore.resetArticleInfo();
        }
    }
    componentWillReceiveProps(nextProps: any) {
        if (nextProps.match.params.id !== this.props.match.params.id || !this.props.match.params.id) {
            this.props.articleStore.resetArticleInfo();
            this.init();
        }
    }
    // ????????????
    onDateChange(date: moment.Moment) {
        this.props.articleStore.setArticleInfo({ create_time: date });
    }
    // Tag
    handleTagChange(tags: string[]) {
        this.props.articleStore.setArticleInfo({ tag: tags });
    }
    // ????????????
    handlePublicChange(e: RadioChangeEvent) {
        this.props.articleStore.setArticleInfo({ is_public: e.target.value });
    }
    // ????????????
    handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.articleStore.setArticleInfo({
            options: {
                featuredImage: `${e.target.value}`,
            },
        });
    }
    // ????????????
    handleUserChange(value: string) {
        this.props.articleStore.setArticleInfo({ user_id: value });
    }

    handleSave(): void {
        this.handleSubmit(ArticleEnum.SAVE);
    }
    handleSaveDraft() {
        this.handleSubmit(ArticleEnum.DRAFT);
    }

    async handleSubmit(status: ArticleEnum) {
        const { articleInfo } = this.props.articleStore;

        if (!articleInfo.title) {
            this.setState({
                hasError: Object.assign({}, this.state.hasError, { title: true }),
            });
            return;
        } else {
            this.setState({
                hasError: Object.assign({}, this.state.hasError, { title: false }),
            });
        }
        if (!articleInfo.pathname) {
            this.setState({
                hasError: Object.assign({}, this.state.hasError, { pathname: true }),
            });
            return;
        } else {
            this.setState({
                hasError: Object.assign({}, this.state.hasError, { pathname: false }),
            });
        }

        const params: any = {};
        if (this.props.match.params.id) {
            params.id = this.props.match.params.id;
        }

        this.props.articleStore.setArticleInfo({ status });

        params.status = status;
        params.title = articleInfo.title;
        params.pathname = articleInfo.pathname;
        params.markdown_content = articleInfo.markdown_content;

        if (params.status === ArticleEnum.SAVE && !params.markdown_content) {
            message.error('??????????????????????????????');
            this.props.articleStore.setArticleInfo({ status: ArticleEnum.DRAFT });
            return;
        }
        params.create_time = articleInfo.create_time;
        params.type = this.type; // type: 0????????????1?????????
        params.allow_comment = articleInfo.allow_comment ? 1 : 0;
        params.push_sites = articleInfo.options.push_sites;

        if (this.type === ArticleTypeEnum.POST) {
            params.cate = articleInfo.cate.map((cate) => cate.id);
            params.tag = articleInfo.tag;
            params.user_id = articleInfo.user_id;
        }

        params.is_public = articleInfo.is_public;
        params.options = JSON.stringify({
            template: articleInfo.options.template,
            featuredImage: articleInfo.options.featuredImage,
            push_sites: articleInfo.options.push_sites,
        });
        // ????????????
        localStorage.removeItem('unsavetype' + this.type + 'id' + params.id);
        // ??????
        const type = this.isPage() ? 'page' : 'post';

        // save pingback
        if (status === ArticleEnum.SAVE) {
            this.props.articleStore.articlePingback(params).subscribe((res) => {
                if (res.errno === 0) {
                    params.markdown_content = res.data;
                }
                this.props.articleStore.articleSubmit(params, this.type).subscribe((res) => {
                    if (res.errno === 0) {
                        if (!params.id && res.data.id) {
                            params.id = res.data.id;
                        }

                        if (status === ArticleEnum.SAVE && articleInfo.is_public) {
                            this.props.articleStore.getArticleInfoById(params.id, this.type);
                            message.success(
                                <>
                                    ????????????, &nbsp;&nbsp;
                                    <a href={`/${type}/${articleInfo.pathname}.html`} target="_blank">
                                        {this.isPage() ? '??????????????????' : '??????????????????'}
                                    </a>
                                </>,
                            );
                        } else {
                            message.success('????????????');
                        }
                    } else {
                        this.props.articleStore.setArticleInfo({ status: ArticleEnum.DRAFT });
                    }
                });
            });
        } else {
            this.props.articleStore.articleSubmit(params, this.type).subscribe((res) => {
                console.log('');
                if (res.errno === 0) {
                    if (!params.id && res.data.id) {
                        params.id = res.data.id;
                    }

                    message.success('????????????');
                } else {
                    this.props.articleStore.setArticleInfo({ status: ArticleEnum.DRAFT });
                }
            });
        }
    }

    handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
        const { autocompletePathname, hasError } = this.state;
        const nextHasError = Object.assign({}, hasError);
        const { articleInfo, setArticleInfo } = this.props.articleStore;
        const nextInfo = {
            title: e.target.value,
            pathname: articleInfo.pathname,
        };
        hasError.title = false;

        if (autocompletePathname && pinyin.isSupported()) {
            let text = '';
            let lastToken;
            const format = (str) => (str ? str.toLowerCase() : '');
            const tokens = pinyin.parse(nextInfo.title);
            tokens.forEach((v) => {
                if (v.type === 2) {
                    text += text && !/\n|\s/.test(lastToken.target) ? '-' + format(v.target) : format(v.target);
                } else {
                    text += (lastToken && lastToken.type === 2 ? '-' : '') + v.target;
                }
                lastToken = v;
            });

            nextInfo.pathname = text;
            hasError.pathname = false;
        }

        this.setState({ hasError: nextHasError });
        setArticleInfo(nextInfo);
    }
    handlePath(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            autocompletePathname: false,
            hasError: Object.assign({}, this.state.hasError, { pathname: false }),
        });
        this.props.articleStore.setArticleInfo({ pathname: e.target.value });
    }
    preview() {
        const { articleInfo } = this.props.articleStore;
        const previewData: PreviewData = {
            title: articleInfo.title || 'Untitled',
            pathname: articleInfo.pathname || 'untitled',
            markdown_content: articleInfo.markdown_content,
            create_time: articleInfo.create_time,
            update_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            user: this.props.userStore.userList.filter((user) => +user.id === +articleInfo.user_id)[0],
            comment_num: 0,
            allow_comment: 0,
            options: JSON.stringify(articleInfo.options),
        };

        if (this.type === 0) {
            previewData.tag = articleInfo.tag.map((tagName) => {
                return this.props.sharedStore.tagList.filter((tag) => tag.name === tagName)[0] || { name: tagName };
            });
            previewData.cate = articleInfo.cate;
        }

        const previewUrl = `/${['post', 'page'][this.type]}/${previewData.pathname}.html?preview=true`;

        let form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', previewUrl);
        form.setAttribute('target', '_blank');

        let hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', 'previewData');
        hiddenField.setAttribute('value', JSON.stringify(previewData));
        form.appendChild(hiddenField);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
    render() {
        const sharedStore = this.props.sharedStore;
        const articleStore = this.props.articleStore;
        const { articleInfo } = articleStore;
        const { tagList, templateList } = sharedStore;
        return (
            <div className="post-article">
                <Row type="flex">
                    <Col span={18}>
                        <ArticleHeader
                            {...this.props}
                            handleTitle={(e: React.ChangeEvent<HTMLInputElement>) => this.handleTitle(e)}
                            handlePath={(e: React.ChangeEvent<HTMLInputElement>) => this.handlePath(e)}
                            preview={() => this.preview()}
                            title={articleInfo.title}
                            pathname={articleInfo.pathname}
                            status={articleInfo.status}
                            isPublic={articleInfo.is_public}
                            type={this.type}
                            hasError={this.state.hasError}
                        />
                        <ArticleEditor type={this.props.type} id={this.props.match.params.id} />
                    </Col>
                    <Col span={6}>
                        <ArticleControlHeader save={() => this.handleSave()} saveDraft={() => this.handleSaveDraft()} />
                        <section className="release-date">
                            <h5>????????????</h5>
                            <DatePicker
                                showTime={true}
                                allowClear={false}
                                format="YYYY-MM-DD HH:mm:ss"
                                value={moment(articleInfo.create_time)}
                                placeholder="???????????????"
                                onChange={(date) => this.onDateChange(date)}
                            />
                        </section>
                        {this.isPage() ? null : (
                            <section className="category">
                                <h5>??????</h5>
                                <ArticleControlCategory
                                    catInitial={
                                        articleInfo.cate && articleInfo.cate.length > 0
                                            ? articleInfo.cate.map((item) => item.id)
                                            : []
                                    }
                                />
                            </section>
                        )}
                        {this.isPage() ? null : (
                            <section className="category">
                                <h5>??????</h5>
                                <ArticleControlTag
                                    tag={articleInfo.tag}
                                    tagList={tagList}
                                    handleTagChange={(values) => this.handleTagChange(values)}
                                />
                            </section>
                        )}
                        {this.isPage() ? (
                            <section className="category">
                                <h5>???????????????</h5>
                                <ArticleControlTemplate
                                    template={articleInfo.options.template}
                                    templateList={templateList}
                                    handleTemplateChange={(value) =>
                                        articleStore.setArticleInfo({
                                            options: { template: value },
                                        })
                                    }
                                />
                            </section>
                        ) : null}
                        <section className="category">
                            <h5>?????????</h5>
                            <ArticleControlPublic
                                isPublic={articleInfo.is_public}
                                handlePublicChange={(e) => this.handlePublicChange(e)}
                            />
                        </section>
                        <section className="category">
                            <h5>????????????</h5>
                            <Checkbox
                                onChange={(e) =>
                                    articleStore.setArticleInfo({
                                        allow_comment: e.target.checked,
                                    })
                                }
                                checked={articleInfo.allow_comment}
                            >
                                ????????????
                            </Checkbox>
                        </section>
                        <section className="category">
                            <h5>????????????</h5>
                            <ArticleControlImage
                                imageUrl={articleInfo.options.featuredImage}
                                handleImageChange={(e) => this.handleImageChange(e)}
                            />
                        </section>
                        {this.isPage() || window.SysConfig.userInfo.type !== 1 ? null : (
                            <section className="category">
                                <h5>????????????</h5>
                                <ArticleControlUser
                                    user={articleInfo.user_id}
                                    users={this.props.userStore.userList}
                                    handleUserChange={(value) => this.handleUserChange(value)}
                                />
                            </section>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Article;
