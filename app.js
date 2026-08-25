/* Prototipe klien — data di localStorage, tanpa server. */
(function () {
  "use strict";

  var STORAGE_KEY = "iamkri-seri-simulasi-registrations";

  /* Cadangan jika series.json tidak bisa di-fetch (buka file://). */
  var EMBEDDED = {
    brand: "IAMKRI",
    brandLong: "Ikatan Ahli Manajemen Konstruksi Ramping Indonesia",
    title: "Seri Simulasi Konstruksi Ramping",
    motto: "Don't be afraid to care",
    timezone: "Asia/Jakarta",
    tzOffset: "+07:00",
    durationMin: 90,
    organizerEmail: "abduh@itb.ac.id",
    organizerName: "Muhamad Abduh",
    sessions: [
      { id: "parade-tim-kerja", no: 1, title: "Parade Tim Kerja", description: "Simulasi parade of trades / zone-flow; belajar variabilitas, WIP, dan serah-terima antar tim.", date: "2026-09-10", weekday: "Kamis", start: "15:30", end: "17:00", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-parade-tim-kerja" },
      { id: "siklops", no: 2, title: "SiklOps", description: "Simulasi kejadian diskrit untuk operasi konstruksi yang berulang (siklik), dari yang sederhana ke yang lebih kompleks.", date: "2026-10-01", weekday: "Kamis", start: "15:30", end: "17:00", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-siklops" },
      { id: "neo-cyclone", no: 3, title: "Neo-CYCLONE", description: "Pemodelan dan simulasi operasi konstruksi berbasis CYCLONE (Halpin), dibantu AI.", date: "2026-10-22", weekday: "Kamis", start: "15:30", end: "17:00", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-neo-cyclone" },
      { id: "siapkerja", no: 4, title: "SiapKerja!", description: "Simulasi Last Planner System untuk rumah tipe 36, dari master plan sampai huddle harian.", date: "2026-11-13", weekday: "Jumat", start: "15:30", end: "17:00", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-siapkerja" },
      { id: "rusun-takt", no: 5, title: "Rusun Takt", description: "Simulasi takt pada rusun tiga lantai; membandingkan push vs JIT, zona, dan pemborosan menunggu.", date: "2026-12-03", weekday: "Kamis", start: "15:30", end: "17:00", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-rusun-takt" },
      { id: "mp2k", no: 6, title: "MP2K", description: "Produksi proyek multimoda (di lapangan, near-site, pasokan jauh) untuk belajar project production management.", date: "2026-12-17", weekday: "Kamis", start: "15:30", end: "17:00", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-mp2k" }
    ]
  };

  var MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  var series = EMBEDDED;

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function parseYmd(ymd) {
    var p = ymd.split("-");
    return { y: +p[0], m: +p[1], d: +p[2] };
  }

  function parseHm(hm) {
    var p = hm.split(":");
    return { h: +p[0], min: +p[1] };
  }

  function formatWhen(s) {
    var d = parseYmd(s.date);
    return s.weekday + ", " + d.d + " " + MONTHS[d.m - 1] + " " + d.y + " · " + s.start.replace(":", ".") + "–" + s.end.replace(":", ".") + " WIB";
  }

  function formatShortDate(s) {
    var d = parseYmd(s.date);
    return d.d + " " + MONTHS[d.m - 1];
  }

  function loadRegs() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveRegs(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function sessionById(id) {
    for (var i = 0; i < series.sessions.length; i++) {
      if (series.sessions[i].id === id) return series.sessions[i];
    }
    return null;
  }

  function countBySession() {
    var counts = {};
    var i, j, r, id;
    for (i = 0; i < series.sessions.length; i++) counts[series.sessions[i].id] = 0;
    var regs = loadRegs();
    for (i = 0; i < regs.length; i++) {
      r = regs[i].sessions || [];
      for (j = 0; j < r.length; j++) {
        id = r[j];
        if (counts[id] != null) counts[id] += 1;
      }
    }
    return counts;
  }

  function renderSessions() {
    var host = $("sessions");
    var counts = countBySession();
    var html = "";
    for (var i = 0; i < series.sessions.length; i++) {
      var s = series.sessions[i];
      var n = counts[s.id] || 0;
      var orang = n === 1 ? "1 orang" : n + " orang";
      html +=
        '<label class="session" data-id="' + s.id + '">' +
          '<input type="checkbox" name="sesi" value="' + s.id + '">' +
          "<span>" +
            '<p class="session-title"><span class="session-no">' + pad(s.no) + "</span> " + escapeHtml(s.title) + "</p>" +
            '<p class="session-when">' + escapeHtml(formatWhen(s)) + "</p>" +
            (s.description ? '<p class="session-desc">' + escapeHtml(s.description) + "</p>" : "") +
          "</span>" +
          '<span class="session-count" data-count-for="' + s.id + '">' + orang + "</span>" +
        "</label>";
    }

    host.innerHTML = html;
    host.addEventListener("change", syncSessionClass);
  }

  function syncSessionClass() {
    var labels = document.querySelectorAll(".session");
    for (var i = 0; i < labels.length; i++) {
      var box = labels[i].querySelector("input");
      labels[i].classList.toggle("is-on", box && box.checked);
    }
  }

  function renderCounts() {
    var counts = countBySession();
    var regs = loadRegs();
    var bits = [];
    for (var i = 0; i < series.sessions.length; i++) {
      var s = series.sessions[i];
      bits.push("<strong>" + escapeHtml(s.title) + "</strong> " + (counts[s.id] || 0));
    }
    var total = regs.length;
    var head = total === 0
      ? "Belum ada pendaftar di peramban ini."
      : "Di peramban ini: <strong>" + total + "</strong> pendaftaran. Per sesi: ";
    $("counts-line").innerHTML = head + (total ? bits.join(" · ") : "");

    var cells = document.querySelectorAll("[data-count-for]");
    for (var c = 0; c < cells.length; c++) {
      var id = cells[c].getAttribute("data-count-for");
      var n = counts[id] || 0;
      cells[c].textContent = n === 1 ? "1 orang" : n + " orang";
    }

    renderRekap(counts, regs);
  }

  function renderRekap(counts, regs) {
    var rows = "";
    for (var i = 0; i < series.sessions.length; i++) {
      var s = series.sessions[i];
      rows +=
        "<tr><td>" + pad(s.no) + " " + escapeHtml(s.title) +
        "</td><td>" + escapeHtml(formatShortDate(s)) +
        '</td><td class="num">' + (counts[s.id] || 0) + "</td></tr>";
    }
    $("rekap").innerHTML =
      "<p>Rekap ini dibaca dari <code>localStorage</code> — tiruan Excel di peramban, bukan server.</p>" +
      "<table><thead><tr><th>Sesi</th><th>Tanggal</th><th>Jumlah</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      "<p style=\"margin:0.8rem 0 0\">Total baris pendaftaran: <strong>" + regs.length + "</strong></p>" +
      '<p style="margin:0.45rem 0 0"><button type="button" class="ghost" id="hapus-rekap">Hapus rekap di peramban ini</button></p>';
    var hapus = $("hapus-rekap");
    if (hapus) {
      hapus.addEventListener("click", function () {
        if (!loadRegs().length) return;
        if (window.confirm("Hapus semua pendaftaran yang tersimpan di peramban ini?")) {
          saveRegs([]);
          renderCounts();
        }
      });
    }
  }

  function selectedIds() {
    var boxes = document.querySelectorAll('input[name="sesi"]:checked');
    var ids = [];
    for (var i = 0; i < boxes.length; i++) ids.push(boxes[i].value);
    return ids;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setErr(id, msg) {
    $(id).textContent = msg || "";
  }

  function validate() {
    var nama = $("nama").value.trim();
    var email = $("email").value.trim();
    var instansi = $("instansi").value.trim();
    var sesi = selectedIds();
    var ok = true;

    setErr("err-nama", "");
    setErr("err-email", "");
    setErr("err-instansi", "");
    setErr("err-sesi", "");
    $("form-banner").classList.remove("is-on");
    $("form-banner").textContent = "";

    if (nama.length < 2) {
      setErr("err-nama", "Nama wajib diisi.");
      ok = false;
    }
    if (!validEmail(email)) {
      setErr("err-email", "Alamat email tidak valid.");
      ok = false;
    }
    if (instansi.length < 2) {
      setErr("err-instansi", "Instansi wajib diisi.");
      ok = false;
    }
    if (sesi.length < 1) {
      setErr("err-sesi", "Pilih minimal satu sesi.");
      ok = false;
    }
    if (!ok) {
      $("form-banner").textContent = "Lengkapi isian yang masih kosong atau kurang tepat.";
      $("form-banner").classList.add("is-on");
    }
    return ok ? { nama: nama, email: email, instansi: instansi, sessions: sesi } : null;
  }

  /* ——— ICS (RFC 5545): VEVENT per sesi, TZID Asia/Jakarta + VTIMEZONE, UTC di DESCRIPTION ——— */

  function icsEscape(text) {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }

  function icsFold(line) {
    var enc = new TextEncoder();
    var out = "";
    var cur = "";
    for (var i = 0; i < line.length; i++) {
      var ch = line.charAt(i);
      var trial = cur + ch;
      if (enc.encode(trial).length > 74) {
        out += cur + "\r\n ";
        cur = ch;
      } else {
        cur = trial;
      }
    }
    return out + cur;
  }

  function utcStamp(date) {
    return (
      date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      "Z"
    );
  }

  function localStamp(ymd, hm) {
    var d = parseYmd(ymd);
    var t = parseHm(hm);
    return d.y + pad(d.m) + pad(d.d) + "T" + pad(t.h) + pad(t.min) + "00";
  }

  /* WIB = UTC+7; 15:30–17:00 WIB = 08:30–10:00 UTC */
  function utcFromJakarta(ymd, hm) {
    var d = parseYmd(ymd);
    var t = parseHm(hm);
    return new Date(Date.UTC(d.y, d.m - 1, d.d, t.h - 7, t.min, 0));
  }

  function buildIcs(chosen, person) {
    var now = utcStamp(new Date());
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//IAMKRI//Seri Simulasi Konstruksi Ramping//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Seri Simulasi Konstruksi Ramping",
      "X-WR-TIMEZONE:Asia/Jakarta",
      "BEGIN:VTIMEZONE",
      "TZID:Asia/Jakarta",
      "X-LIC-LOCATION:Asia/Jakarta",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0700",
      "TZOFFSETTO:+0700",
      "TZNAME:WIB",
      "DTSTART:19700101T000000",
      "END:STANDARD",
      "END:VTIMEZONE"
    ];

    for (var i = 0; i < chosen.length; i++) {
      var s = chosen[i];
      var startLocal = localStamp(s.date, s.start);
      var endLocal = localStamp(s.date, s.end);
      var startUtc = utcStamp(utcFromJakarta(s.date, s.start));
      var endUtc = utcStamp(utcFromJakarta(s.date, s.end));
      var desc =
        "Seri Simulasi Konstruksi Ramping — " + s.title + "\n" +
        formatWhen(s) + " (Asia/Jakarta)\n" +
        "UTC: " + startUtc + " – " + endUtc + "\n\n" +
        "Tautan Microsoft Teams (placeholder):\n" + s.teamsUrl + "\n\n" +
        "Untuk: " + person.nama + " (" + person.email + "), " + person.instansi + "\n" +
        "Nanti email dari abduh@itb.ac.id membawa tautan Teams yang sama.";

      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + s.id + "-2026@iamkri.seri-simulasi");
      lines.push("DTSTAMP:" + now);
      lines.push("DTSTART;TZID=Asia/Jakarta:" + startLocal);
      lines.push("DTEND;TZID=Asia/Jakarta:" + endLocal);
      lines.push("SUMMARY:" + icsEscape(s.title + " — Seri Simulasi Konstruksi Ramping"));
      lines.push("DESCRIPTION:" + icsEscape(desc));
      lines.push("URL:" + s.teamsUrl);
      lines.push("LOCATION:Microsoft Teams");
      lines.push("ORGANIZER;CN=" + icsEscape(series.organizerName || "Muhamad Abduh") + ":mailto:" + series.organizerEmail);
      lines.push("STATUS:CONFIRMED");
      lines.push("TRANSP:OPAQUE");
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    return lines.map(icsFold).join("\r\n") + "\r\n";
  }

  function downloadIcs(ics) {
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "IAMKRI-Seri-Simulasi.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function showThanks(person, chosen) {
    var items = "";
    for (var i = 0; i < chosen.length; i++) {
      items += "<li><strong>" + escapeHtml(chosen[i].title) + "</strong> — " + escapeHtml(formatWhen(chosen[i])) + "</li>";
    }
    $("thanks").innerHTML =
      "<h2>Terima kasih, " + escapeHtml(person.nama) + ".</h2>" +
      "<p>Anda tercatat untuk sesi berikut.</p>" +
      "<ul>" + items + "</ul>" +
      "<p>Berkas kalender <code>.ics</code> sudah diunduh. Impor ke Outlook, Google Kalender, atau Apple Kalender.</p>" +
      '<p class="note">Nanti email dari abduh@itb.ac.id membawa tautan Teams yang sama. Mode ini baru simulasi di browser.</p>' +
      '<p><button type="button" class="ghost" id="unduh-lagi">Unduh ulang kalender</button> · ' +
      '<button type="button" class="ghost" id="daftar-lagi">Daftar orang lain</button></p>';
    $("thanks").classList.add("is-on");
    $("form-wrap").classList.add("is-off");
    $("unduh-lagi").addEventListener("click", function () {
      downloadIcs(buildIcs(chosen, person));
    });
    $("daftar-lagi").addEventListener("click", function () {
      $("form").reset();
      syncSessionClass();
      $("thanks").classList.remove("is-on");
      $("thanks").innerHTML = "";
      $("form-wrap").classList.remove("is-off");
      $("nama").focus();
    });
    $("thanks").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var person = validate();
    if (!person) {
      var first = document.querySelector(".err:not(:empty)");
      if (first && first.previousElementSibling) first.previousElementSibling.focus();
      return;
    }
    var chosen = [];
    for (var i = 0; i < person.sessions.length; i++) {
      var s = sessionById(person.sessions[i]);
      if (s) chosen.push(s);
    }
    var regs = loadRegs();
    regs.push({
      id: "r-" + Date.now(),
      nama: person.nama,
      email: person.email,
      instansi: person.instansi,
      sessions: person.sessions,
      at: new Date().toISOString()
    });
    saveRegs(regs);
    renderCounts();
    downloadIcs(buildIcs(chosen, person));
    showThanks(person, chosen);
  }

  function bind() {
    $("form").addEventListener("submit", onSubmit);
    ["nama", "email", "instansi"].forEach(function (id) {
      $(id).addEventListener("input", function () { setErr("err-" + id, ""); });
    });
  }

  function boot(data) {
    series = data;
    renderSessions();
    renderCounts();
    bind();
  }

  function start() {
    fetch("series.json")
      .then(function (res) {
        if (!res.ok) throw new Error("series.json");
        return res.json();
      })
      .then(boot)
      .catch(function () { boot(EMBEDDED); });
  }

  start();
})();
