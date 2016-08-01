module.exports = {
  parse_dn(dn) {
    const dns = dn.split('/');

    const obj = {};

    for (let i = 0; i < dns.length; i ++) {
      const t = dns[i];
      const kv = t.split('=');
      if (kv.length === 2) {
        obj[kv[0]] = kv[1];
        continue;
      }
    }

    return obj;
  }
}
