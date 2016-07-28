/*
 * @Author: detailyang
 * @Date:   2016-02-18 12:43:02
* @Last modified by:   detailyang
* @Last modified time: 2016-07-14T14:10:08+08:00
 */
import koarouter from 'koa-router';
import controllers from '../../controllers';


const router = koarouter({
  prefix: '/api/pkis',
});
module.exports = router;


router.get('/ca', controllers.pki.ca.get);
router.get('/client', controllers.pki.client.getByUid);
router.get('/client/key', controllers.pki.client.getKeyByUid);
router.get('/client/pkcs12', controllers.pki.client.getPkcs12ByUid);
router.get('/client/crt', controllers.pki.client.getCrtByUid);
router.post('/client', controllers.pki.client.post);
