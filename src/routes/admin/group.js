/*
 * @Author: detailyang
 * @Date:   2016-02-18 12:43:02
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T16:45:43+08:00
 */


import koarouter from 'koa-router';
import controllers from '../../controllers';


const router = koarouter({
  prefix: '/admin/groups',
});
module.exports = router;

router.get('/:id(\\d+)/peoples', controllers.group.list.people.get);
router.post('/:id(\\d+)/peoples', controllers.group.list.people.post);
router.get('/', controllers.group.list.get);
router.post('/', controllers.group.list.post);
router.delete('/:id(\\d+)', controllers.group.detail.deleteById);
router.put('/:id(\\d+)', controllers.group.detail.updateById);