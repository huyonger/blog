const preventMessage = 'PREVENT_NEXT_PROCESS';
const { parse } = require('url');

module.exports = {
    prevent() {
        throw new Error(preventMessage);
    },
    isPrevent(err) {
        return think.isError(err) && err.message === preventMessage;
    },
    isSameOrigin(referrer, site_url) {
        if (!referrer || !site_url) {
            return false;
        }
        let siteUrlHost = parse(site_url).host;
        let referrerHost = parse(referrer).host;
        if (!siteUrlHost || !referrerHost) {
            return false;
        }

        if (siteUrlHost.length < referrerHost.length) {
            if (referrerHost.slice(-siteUrlHost.length) !== siteUrlHost) {
                return false;
            }
        } else if (siteUrlHost.slice(-referrerHost.length) !== referrerHost) {
            return false;
        }
        return true;
    },
};
