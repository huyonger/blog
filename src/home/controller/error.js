const Base = require('./base');

module.exports = class extends Base {
    _404Action() {
        this.ctx.response.status = 404;
        return this.displayView('404');
    }
};
