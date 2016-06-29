/*
 * @Author: detailyang
 * @Date:   2016-02-18 12:43:02
* @Last modified by:   detailyang
* @Last modified time: 2016-06-29T15:06:09+08:00
 */
import koarouter from 'koa-router';
import controllers from '../../controllers';
import utils from '../../utils';


const router = koarouter({
  prefix: '/api/pkis',
});
module.exports = router;

const adminOnly = async (ctx, next) => {
  if (!ctx.session.is_admin) {
    throw new utils.error.PermissionError('you are not admin');
  }
  await next();
};

router.get('/ca', controllers.pki.ca.get);
router.get('/client', controllers.pki.client.getByUid);
router.get('/client/key', controllers.pki.client.getKeyByUid);
router.get('/client/pkcs12', controllers.pki.client.getPkcs12ByUid);
router.get('/client/crt', controllers.pki.client.getCrtByUid);
router.post('/client', controllers.pki.client.post);
router.get('/server', controllers.pki.server.get);
router.get('/server/:id(\\d+)/pkcs12', adminOnly, controllers.pki.server.getPkcs12);
router.get('/server/:id(\\d+)/csr', adminOnly, controllers.pki.server.getCsr);
router.get('/server/:id(\\d+)/key', adminOnly, controllers.pki.server.getKey);
router.get('/server/:id(\\d+)/crt', controllers.pki.server.getCrt);
router.post('/server', adminOnly, controllers.pki.server.post);
