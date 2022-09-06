module.exports =
    think.env === 'now'
        ? []
        : [
              {
                  type: 'one',
                  interval: 1000 * 60 * 10,
                  handle: 'crontab/sync_comment',
              },
              {
                  type: 'one',
                  interval: 1000 * 60 * 60 * 24,
                  handle: 'crontab/baidu',
              },
              {
                  type: 'one',
                  interval: 60 * 60 * 1000,
                  handle: 'admin/cron/rss',
              },
          ];
