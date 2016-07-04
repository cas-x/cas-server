/*
 * @Author: detailyang
 * @Date:   2016-02-29 14:32:13
* @Last modified by:   detailyang
* @Last modified time: 2016-07-04T10:00:09+08:00
 */
import koarouter from 'koa-router';
import getRawBody from 'raw-body';

import controllers from '../../controllers';


const router = koarouter({
  prefix: '/public/pkis',
});
module.exports = router;

router.post('/ocsp', async (ctx, next) => {
  ctx.request.body = await getRawBody(ctx.req, {
    length: ctx.length,
    limit: '1mb',
    encoding: ctx.charset,
  });
  await next();
}, controllers.pki.ca.ocsp.post);
router.get('/ocsp/:ocsp(.+)', controllers.pki.ca.ocsp.get);
router.get('/crl', controllers.pki.ca.crl);
router.get('/ca', controllers.pki.ca.get);
