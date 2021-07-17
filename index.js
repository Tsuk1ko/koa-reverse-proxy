require('dotenv').config();
const Koa = require('koa');
const proxy = require('koa-proxies');

new Koa()
  .use((ctx, next) => {
    const { token, url } = ctx.query;
    if (token === process.env.TOKEN && url) return next();
  })
  .use(
    proxy('/', (params, ctx) => {
      const url = new URL(ctx.query.url);
      ctx.request.url = ctx.query.url;
      return {
        target: `${url.protocol}//${url.host}`,
        changeOrigin: true,
        logs: true,
      };
    })
  )
  .listen(process.env.PORT);
