import * as React from 'react';
import BreadCrumb from '../../../components/breadcrumb';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { GeneralProps } from './general.model';
import { UploadChangeParam } from 'antd/lib/upload';
import './general.less';
const FormItem = Form.Item;

@inject('generalStore')
@observer
class GeneralForm extends React.Component<GeneralProps, {}> {
    constructor(props: GeneralProps) {
        super(props);
    }

    componentDidMount() {
        //
    }

    handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.generalStore.submit(values);
            }
        });
    };

    handleChange = (info: UploadChangeParam, type: 'logo' | 'favicon') => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({ loading: false });
            this.handleFile(info, type);
        }
    };

    getBase64(img: any, callback: Function) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleFile(fileInfo: UploadChangeParam, type: 'logo' | 'favicon') {
        if (fileInfo.file.response.errno !== 0) {
            message.error(fileInfo.file.response.errmsg);
        } else {
            const url = fileInfo.file.response.data;
            if (type === 'logo') {
                this.props.form.setFieldsValue({
                    logo_url: url,
                });
                window.SysConfig.options.logo_url = url;
                this.props.generalStore.setData({ options: window.SysConfig.options });
            } else {
                this.props.form.setFieldsValue({
                    favicon_url: url,
                });
                window.SysConfig.options.favicon_url = url;
                this.props.generalStore.setData({ options: window.SysConfig.options });
            }
        }
    }

    beforeUpload(file: File) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('??????????????????5MB!');
        }
        return isLt5M;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xl: { span: 24 },
                sm: { span: 24 },
            },
            wrapperCol: {
                xl: { span: 8 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xl: {
                    span: 16,
                    offset: 0,
                },
            },
        };

        const { options } = window.SysConfig;
        const { loading } = this.props.generalStore;
        const { logo_url, favicon_url } = options;
        let [logoUrl, iconUrl] = [logo_url, favicon_url];
        if (logoUrl && !logoUrl.includes('data:image')) {
            logoUrl += (logoUrl.includes('?') ? '&' : '?') + 'm=' + Date.now();
        }
        if (iconUrl) {
            iconUrl += (iconUrl.includes('?') ? '&' : '?') + 'm=' + Date.now();
        }
        const uploadButton = (
            <div>
                <Icon type={this.props.generalStore.loading.logo ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <>
                <BreadCrumb className="breadcrumb" {...this.props} />
                <div className="options-general-page page-list">
                    <h3 className="page-title">????????????</h3>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="????????????">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '?????????????????????',
                                    },
                                ],
                                initialValue: options.title,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="LOGO ??????">
                            <Upload
                                name="file"
                                listType="picture-card"
                                accept=""
                                className="avatar-uploader"
                                showUploadList={false}
                                style={{ width: 140, height: 140 }}
                                action="/admin/api/file"
                                beforeUpload={this.beforeUpload}
                                onChange={(e) => this.handleChange(e, 'logo')}
                            >
                                {logoUrl ? <img src={logo_url} alt="avatar" /> : uploadButton}
                            </Upload>
                            {getFieldDecorator('logo_url', {
                                initialValue: logo_url,
                            })(
                                <Input
                                    onChange={(e) => {
                                        window.SysConfig.options.logo_url = e.target.value;
                                        this.props.generalStore.setData({
                                            options: window.SysConfig.options,
                                        });
                                    }}
                                />,
                            )}
                            <p>??????????????? 140x140px???</p>
                        </FormItem>
                        <FormItem {...formItemLayout} label="????????????">
                            {getFieldDecorator('description', {
                                rules: [
                                    {
                                        required: true,
                                        message: '?????????????????????',
                                    },
                                ],
                                initialValue: options.description,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="????????????">
                            {getFieldDecorator('site_url', {
                                initialValue: options.site_url,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="????????????">
                            {getFieldDecorator('preview_url', {
                                initialValue: options.preview_url,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Favicon ??????">
                            <Upload
                                name="file"
                                listType="picture-card"
                                accept=".ico"
                                className="avatar-uploader"
                                showUploadList={false}
                                style={{ width: 140, height: 140 }}
                                action="/admin/api/file"
                                beforeUpload={this.beforeUpload}
                                onChange={(e) => this.handleChange(e, 'favicon')}
                            >
                                {iconUrl ? <img src={favicon_url} alt="avatar" /> : uploadButton}
                            </Upload>
                            {getFieldDecorator('favicon_url', {
                                initialValue: favicon_url,
                            })(
                                <Input
                                    onChange={(e) => {
                                        window.SysConfig.options.favicon_url = e.target.value;
                                        this.props.generalStore.setData({
                                            options: window.SysConfig.options,
                                        });
                                    }}
                                />,
                            )}
                            <p>??????????????? 128x128px???</p>
                        </FormItem>
                        <FormItem {...formItemLayout} label="?????????">
                            {getFieldDecorator('keywords', {
                                initialValue: options.keywords,
                            })(<Input />)}
                            <p>?????????????????? "," ?????????????????????.</p>
                        </FormItem>
                        <FormItem {...formItemLayout} label="GitHub ??????">
                            {getFieldDecorator('github_url', {
                                initialValue: options.github_url,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Twitter ??????">
                            {getFieldDecorator('twitter_url', {
                                initialValue: options.twitter_url,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="????????????????????????">
                            {getFieldDecorator('miitbeian', {
                                initialValue: options.miitbeian,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="????????????????????????">
                            {getFieldDecorator('mpsbeian', {
                                initialValue: options.mpsbeian,
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" loading={loading.submit}>
                                ??????
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </>
        );
    }
}
const General = Form.create()(GeneralForm);
export default General;
