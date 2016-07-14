/*
 * @Author: detailyang
 * @Date:   2016-02-18 12:43:02
* @Last modified by:   detailyang
* @Last modified time: 2016-07-14T14:08:18+08:00
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
