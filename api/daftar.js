module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://workshop-simulasi.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method" });
    return;
  }

  var url = process.env.POWER_AUTOMATE_DAFTAR_URL;
  if (!url) {
    res.status(500).json({ ok: false, error: "not-configured" });
    return;
  }

  var body = req.body || {};
  var nama = String(body.nama || "").trim();
  var email = String(body.email || "").trim();
  var instansi = String(body.instansi || "").trim();
  var sesiIds = String(body.sesiIds || "").trim();
  var sesiJudul = String(body.sesiJudul || "").trim();
  var timestamp = String(body.timestamp || new Date().toISOString());

  if (nama.length < 2 || !email.includes("@") || instansi.length < 2 || !sesiIds) {
    res.status(400).json({ ok: false, error: "invalid" });
    return;
  }

  var payload = {
    Timestamp: timestamp,
    Nama: nama,
    Email: email,
    Instansi: instansi,
    SesiIds: sesiIds,
    SesiJudul: sesiJudul
  };

  try {
    var r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      res.status(502).json({ ok: false, error: "excel" });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ ok: false, error: "excel" });
  }
};
