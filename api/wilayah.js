// Vercel Serverless Function: api/wilayah.js
const ACEH_WILAYAH_TREE = require('./wilayah_data.json');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type = 'tree', kabupaten_id, kecamatan_id } = req.query || {};

  // Built-in Complete Master Data from db_sistem_terintegrasi (18 Kabupaten, 215 Kecamatan, 817 Kelurahan)
  if (type === 'tree') {
    return res.status(200).json({ status: 'success', data: ACEH_WILAYAH_TREE });
  }

  if (type === 'kabupaten') {
    const list = ACEH_WILAYAH_TREE.map(k => ({ id: k.id, nama_kabupaten: k.nama }));
    return res.status(200).json({ status: 'success', data: list });
  }

  if (type === 'kecamatan') {
    const kab = ACEH_WILAYAH_TREE.find(k => k.id == Number(kabupaten_id));
    const list = kab ? kab.kecamatan.map(c => ({ id: c.id, nama_kecamatan: c.nama })) : [];
    return res.status(200).json({ status: 'success', data: list });
  }

  if (type === 'kelurahan') {
    let list = [];
    for (const kab of ACEH_WILAYAH_TREE) {
      const kec = kab.kecamatan.find(c => c.id == Number(kecamatan_id));
      if (kec) {
        list = kec.kelurahan.map(l => ({ id: l.id, nama_kelurahan: l.nama, kode_adm4: l.kode_adm4 }));
        break;
      }
    }
    return res.status(200).json({ status: 'success', data: list });
  }

  return res.status(200).json({ status: 'success', data: ACEH_WILAYAH_TREE });
};

module.exports.ACEH_WILAYAH_TREE = ACEH_WILAYAH_TREE;
