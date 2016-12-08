/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-16T22:03:58+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T14:20:40+08:00
* @License: The MIT License (MIT)
*/


import path from 'path';


const pkidir = process.env.CAS_PKI_DIR || path.join(
  path.dirname(path.dirname(path.dirname(__filename))), 'pki');

if (process.env.NODE_ENV === 'dev') {
  module.exports = {
    opensslconf: '/usr/local/etc/openssl/openssl.cnf',
    dir: pkidir,
    days: process.env.CAS_PKI_DAYS || 30,
    password: process.env.CAS_PKI_PASSWORD || 'password',
    subj: process.env.CAS_PKI_SUBJ || '/C=US/ST=NY/L=New York/O=CAS',
    ca: {
      passin: process.env.CAS_PKI_CA_PASSIN || '1234',
      x509: process.env.CAS_PKI_CA_X509 || path.join(pkidir, 'x509.cnf.dev'),
      unsecurekey: process.env.CAS_PKI_CA_KEY || path.join(pkidir, 'unsecure.ca.key'),
      key: process.env.CAS_PKI_CA_KEY || path.join(pkidir, 'ca.key'),
      crt: process.env.CAS_PKI_CA_CRT || path.join(pkidir, 'ca.crt'),
    },
  };
} else if (process.env.NODE_ENV === 'test') {
  module.exports = {
    opensslconf: '/etc/pki/tls/openssl.cnf',
    dir: pkidir,
    days: process.env.CAS_PKI_DAYS || 30,
    password: process.env.CAS_PKI_PASSWORD || 'password',
    subj: process.env.CAS_PKI_SUBJ || '/C=US/ST=NY/L=New York/O=CAS',
    ca: {
      passin: process.env.CAS_PKI_CA_PASSIN || '1234',
      x509: process.env.CAS_PKI_CA_X509 || path.join(pkidir, 'x509.cnf.test'),
      unsecurekey: process.env.CAS_PKI_CA_KEY || path.join(pkidir, 'unsecure.ca.key'),
      key: process.env.CAS_PKI_CA_KEY || path.join(pkidir, 'ca.key'),
      crt: process.env.CAS_PKI_CA_CRT || path.join(pkidir, 'ca.crt'),
    },
  };
} else {
  module.exports = {
    opensslconf: '/etc/pki/tls/openssl.cnf',
    dir: pkidir,
    days: process.env.CAS_PKI_DAYS || 30,
    password: process.env.CAS_PKI_PASSWORD || 'password',
    subj: process.env.CAS_PKI_SUBJ || '/C=US/ST=NY/L=New York/O=CAS',
    ca: {
      passin: process.env.CAS_PKI_CA_PASSIN || '1234',
      x509: process.env.CAS_PKI_CA_X509 || path.join(pkidir, 'x509.cnf.prod'),
      unsecurekey: process.env.CAS_PKI_CA_KEY || path.join(pkidir, 'unsecure.ca.key'),
      key: process.env.CAS_PKI_CA_KEY || path.join(pkidir, 'ca.key'),
      crt: process.env.CAS_PKI_CA_CRT || path.join(pkidir, 'ca.crt'),
    },
  };
}
