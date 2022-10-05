const { parse } = require('node-html-parser');

module.exports = (opts, app) => {
    return (ctx, next) => {
        return next().then(() => {
            let content = ctx.body;
            let root = parse(content);
            ctx.body = compressHTML(root);
        });
    };
};

const token_def_val = {
    link: { media: 'screen' },
    input: { type: 'text' },
    form: { method: 'get' },
    script: { type: 'text/javascript' },
    meta: { charset: 'UTF-8', 'http-equiv': 'X-UA-Compatible' },
};
function compressHTML(node) {
    // 1.删除标签特定属性
    node.removeWhitespace();
    compressHTMLTokenDefVal(node);
    // 2.删除特定闭合标签
    let content = node.toString();
    content = content.replace(/<\/(html|body|colgroup|thead|tr|tbody|td|p|dt|dd|li|option|tfoot)>/g, '');
    // 3.删除特定only_name属性
    content = content.replace(/(disable|selected|checked|readonly|multiple)/g, '');
    content = content.replace(/\n|\r/g, '');
    return content;
}

function compressHTMLTokenDefVal(node) {
    if (node.nodeType === 1 && node.tagName) {
        const tagName = node.tagName.toLowerCase();
        const removeAttributes = token_def_val[tagName] || [];
        for (let key in removeAttributes) {
            if (node.getAttribute(key) === removeAttributes[key]) {
                node.removeAttribute(key);
            }
        }
    }
    for (let childNode of node.childNodes) {
        compressHTMLTokenDefVal(childNode);
    }
}
