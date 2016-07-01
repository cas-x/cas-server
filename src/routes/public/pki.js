/*
 * @Author: detailyang
 * @Date:   2016-02-29 14:32:13
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T17:01:46+08:00
 */
import koarouter from 'koa-router';

import controllers from '../../controllers';


const router = koarouter({
  prefix: '/public/pkis',
});
module.exports = router;

router.get('/ocsp', controllers.pki.ca.ocsp);
router.get('/crl', controllers.pki.ca.crl);
