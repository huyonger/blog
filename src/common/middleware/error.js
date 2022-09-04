const helper = require('think-helper');

module.exports = (opts, app) => {
    return (ctx, next) => {
        let errorCallback;
        if (opts && helper.isFunction(opts.error)) {
            errorCallback = opts.error;
        } else {
            errorCallback = console.error.bind(console);
        }
        return next().catch((err) => {
            if (errorCallback(err, ctx) === false) {
                return Promise.resolve();
            }
            throw err;
        });
    };
};
