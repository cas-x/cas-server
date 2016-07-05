/*
 * @Author: detailyang
 * @Date:   2016-03-10 12:52:31
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T10:51:41+08:00
 */


module.exports = {
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
};
