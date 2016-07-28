/*
 * @Author: detailyang
 * @Date:   2016-02-18 12:43:02
* @Last modified by:   detailyang
* @Last modified time: 2016-07-19T09:57:51+08:00
 */
import koarouter from 'koa-router';
import controllers from '../../controllers';


const router = koarouter({
  prefix: '/admin/pkis',
});
module.exports = router;


router.get('/server/:id(\\d+)/pkcs12', controllers.pki.server.getPkcs12);
router.get('/server/:id(\\d+)/csr', controllers.pki.server.getCsr);
router.get('/server/:id(\\d+)/key', controllers.pki.server.getKey);
router.get('/server/:id(\\d+)/crt', controllers.pki.server.getCrt);
router.get('/server', controllers.pki.server.get);
router.post('/server', controllers.pki.server.post);
router.delete('/server/:id(\\d+)', controllers.pki.server.delete);
