/**

* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:06:56+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T10:23:26+08:00
* @License: The MIT License (MIT)
*/


import { readFileSync } from 'fs';


import config from '../../config';
import models from '../../models';
import utils from '../../utils';
import { pushdSync, popdSync, exec } from '../../utils/shell';


module.exports = {
  async getByUid(ctx) {
    const id = ctx.session.id;

    const client = await models.pki.findOne({
      attributes: ['id', 'days', 'name', 'created_at'],
      where: {
        uid: id,
        is_delete: false,
      },
    });

    if (!client) {
      throw new utils.error.NotFoundError('dont find client pki');
    }

    ctx.return.data.value = client;
    ctx.body = ctx.return;
  },

  async getKeyByUid(ctx) {
    const id = ctx.session.id;

    const client = await models.pki.findOne({
      attributes: ['id', 'key', 'name'],
      where: {
        uid: id,
        is_delete: false,
      },
    });

    if (!client) {
      throw new utils.error.NotFoundError('dont find client pki');
    }

    ctx.type = 'application/octet-stream';
    ctx.set('Content-Disposition', `attachment; filename=\"${client.name}.key\"`);
    ctx.body = client.key;
  },

  async getPkcs12ByUid(ctx) {
    const id = ctx.session.id;

    const client = await models.pki.findOne({
      attributes: ['id', 'pkcs12', 'name'],
      where: {
        uid: id,
        is_delete: false,
      },
    });

    if (!client) {
      throw new utils.error.NotFoundError('dont find client pkcs12');
    }

    ctx.type = 'application/octet-stream';
    ctx.set('Content-Disposition', `attachment; filename=\"${client.name}.p12\"`);
    ctx.body = client.pkcs12;
  },

  async getCrtByUid(ctx) {
    const id = ctx.session.id;

    const client = await models.pki.findOne({
      attributes: ['id', 'crt', 'name'],
      where: {
        uid: id,
        is_delete: false,
      },
    });

    if (!client) {
      throw new utils.error.NotFoundError('dont find client crt');
    }

    ctx.type = 'application/octet-stream';
    ctx.set('Content-Disposition', `attachment; filename=\"${client.name}.crt\"`);
    ctx.body = client.crt;
  },

  async getCsrByUid(ctx) {
    const id = ctx.session.id;

    const client = await models.pki.findOne({
      attributes: ['id', 'csr', 'name'],
      where: {
        uid: id,
        is_delete: false,
      },
    });

    if (!client) {
      throw new utils.error.NotFoundError('dont find client csr');
    }

    ctx.type = 'application/octet-stream';
    ctx.set('Content-Disposition', `attachment; filename=\"${client.name}.csr\"`);
    ctx.body = client.crt;
  },

  async post(ctx) {
    let pki = {
      id: 0,
    };
    const certPassword = ctx.request.body.cert_password || config.pki.password;
    const loginPassword = ctx.request.body.login_password;
    const days = config.pki.days;
    const cn = `CN=${ctx.session.username}`;

    // Actually, CAS dont care work directory
    if (!cn) {
      throw new utils.error.ParamsError('commonname cannot be empty');
    }
    if (!loginPassword) {
      throw new utils.error.ParamsError('login password cannot be empty');
    }
    if (!certPassword) {
      throw new utils.error.ParamsError('cert password cannot be empty');
    }
    if (loginPassword.indexOf(' ') >= 0 || certPassword.indexOf(' ') >= 0) {
      throw new utils.error.ParamsError('password cannot include whitespace');
    }

    // check login password
    const user = await models.user.findOne({
      attributes: ['id', 'password'],
      where: {
        id: ctx.session.id,
      },
    });
    if (!user) {
      throw new utils.error.NotFoundError(`no username: ${ctx.session.username}`);
    }
    if (!utils.password.check(loginPassword, user.dataValues.password)) {
      throw new utils.error.ParamsError('login password not right');
    }

    pushdSync(config.pki.dir);
    try {
      const key = await exec(`openssl genrsa -des3 -out ${cn}.key `
                           + `-passout pass:${certPassword} 2048`);
      if (key.code) {
        throw new utils.error.ServerError('generate rsa error');
      }
      const csr = await exec(`openssl req -new -key ${cn}.key -out ${cn}.csr `
                           + `-passin pass:${certPassword} -subj "${config.pki.subj}/${cn}"`);
      if (csr.code) {
        throw new utils.error.ServerError('req error');
      }

      pki = await models.pki.create({
        days,
        name: cn,
        uid: ctx.session.id,
        type: 1,
      });
      if (!pki) {
        throw new utils.error.ServerError('create pki error');
      }

      const crt = await exec('openssl x509 -req -sha256 '
                            + `-days ${days} -passin pass:${config.pki.ca.passin} `
                            + `-in ${cn}.csr -CA ca.crt -CAkey ca.key -set_serial ${pki.id} `
                            + `-out ${cn}.crt -extfile ${config.pki.ca.x509}`);
      if (crt.code) {
        throw new utils.error.ServerError('x509 error');
      }

      const pkcs12 = await exec('openssl pkcs12 -export -clcerts '
                              + `-passin pass:${certPassword} -in ${cn}.crt `
                              + `-passout pass:${certPassword} `
                              + `-inkey ${cn}.key -out ${cn}.p12`);
      if (pkcs12.code) {
        throw new utils.error.ServerError('pkcs12 error');
      }
    } catch (e) {
      throw new utils.error.ServerError(e.message);
    }

    const rv = await models.pki.update({
      pkcs12: readFileSync(`${cn}.p12`),
      key: readFileSync(`${cn}.key`),
      csr: readFileSync(`${cn}.csr`),
      crt: readFileSync(`${cn}.crt`),
      is_delete: false,
    }, {
      where: {
        id: pki.id,
      },
    });
    if (!rv) {
      throw new utils.error.ServerError('update pki error');
    }

    // ignore result
    await models.pki.destroy({
      where: {
        uid: ctx.session.id,
        id: {
          ne: pki.id,
        },
      },
    });
    // ignore whether we popd right or not right
    popdSync();

    ctx.body = ctx.return;
  },
};
