/*
 * @Author: detailyang
 * @Date:   2016-02-17 15:18:34
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T17:03:52+08:00
 */


import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import config from './src/config';
import middlewares from './src/middlewares';
import routes from './src/routes';


const app = new Koa();

app.use(middlewares.log);
app.use(middlewares.error);
app.use(middlewares.return);
app.use(middlewares.session);
if (process.env.NODE_ENV === 'dev') {
  app.use(middlewares.webpack);
} else {
  app.use(middlewares.serve);
}
app.use(middlewares.acl);
app.use(bodyParser());
app.use(middlewares.page);
app.use(middlewares.view);
app.use(middlewares.index);
app.use(middlewares.cache);

app.use(routes.admin.user.routes());
app.use(routes.admin.oauth.routes());
app.use(routes.oauth.user.routes());
app.use(routes.api.user.routes());
app.use(routes.api.pki.routes());
app.use(routes.public.user.routes());
app.use(routes.public.oauth.routes());
app.use(routes.public.pki.routes());

app.listen(config.cas.port, () => {
  console.log(`server listen ${config.cas.port}`);
});

module.exports = app;
