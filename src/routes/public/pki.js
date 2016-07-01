/*
 * @Author: detailyang
 * @Date:   2016-02-29 14:32:13
* @Last modified by:   detailyang
* @Last modified time: 2016-07-01T15:41:51+08:00
 */
import koarouter from 'koa-router';

import controllers from '../../controllers';


const router = koarouter({
  prefix: '/public/pkis',
});
module.exports = router;

router.post('/ocsp', controllers.pki.ca.ocsp.post);
router.get('/ocsp/:ocsp(.+)', controllers.pki.ca.ocsp.get);
router.get('/crl', controllers.pki.ca.crl);
