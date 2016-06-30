/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T02:07:46+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T14:19:55+08:00
* @License: The MIT License (MIT)
*/


import koarouter from 'koa-router';
import utils from '../../utils';
import convert from 'koa-convert';
import koaBody from 'koa-body';
import controllers from '../../controllers';


const router = koarouter({
  prefix: '/oauth/users',
});
const koabody = koaBody({
  multipart: true,
});
module.exports = router;

const adminOnly = async (ctx, next) => {
  if (!ctx.oauth.is_admin) {
    throw new utils.error.PermissionError('you are not admin');
  }
  await next();
};

router.post('/', adminOnly, controllers.user.list.post);
router.post('/dynamicpassword', adminOnly, controllers.user.detail.dynamicpassword.post);
router.put('/avatar', adminOnly, convert(koabody), controllers.user.detail.avatar.post);

router.get('/one', controllers.user.detail.getOne);
router.get('/', controllers.user.list.get);
router.get('/self', controllers.oauth.detail.oauth.getUser);
router.post('/login', controllers.user.detail.login);
router.post('/logout', controllers.user.detail.logout);

router.get('/:username(.+)', controllers.user.detail.getByUsername);
router.put('/:username(.+)', adminOnly, controllers.user.detail.updateByUsername);
