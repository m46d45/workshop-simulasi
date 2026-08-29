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
      { id: "parade-tim-kerja", no: 1, title: "Parade Tim Kerja", description: "Lima tim kerja. Semua sibuk. Proyek tetap molor. Pelajari dampak variabilitas, WIP, dan batch serah-terima terhadap aliran produksi — sisi konstruksi ramping dan sisi operasi sekaligus.", softwareLabel: "Parade Tim Kerja", softwareUrl: "https://parade-tim-kerja.vercel.app", date: "2026-09-19", weekday: "Sabtu", start: "08:00", end: "09:30", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-parade-tim-kerja" },
      { id: "siklops", no: 2, title: "SiklOps", description: "Operasi konstruksi adalah siklus, bukan baris Gantt. Throughput, utilisasi, antrian, dan biaya tunggu — dari earthmoving sampai tower crane.", softwareLabel: "SiklOps", softwareUrl: "https://siklops.vercel.app", date: "2026-10-17", weekday: "Sabtu", start: "08:00", end: "09:30", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-siklops" },
      { id: "neo-cyclone", no: 3, title: "Neo-CYCLONE", description: "Warisan CYCLONE Halpin di peramban. Model operasi, temukan bottleneck, hitung unit cost. AI membantu menggambar; Anda yang menjaga logika.", softwareLabel: "Neo-CYCLONE", softwareUrl: "https://neo-cyclone.vercel.app", date: "2026-10-31", weekday: "Sabtu", start: "08:00", end: "09:30", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-neo-cyclone" },
      { id: "siapkerja", no: 4, title: "SiapKerja!", description: "Last Planner System untuk rumah tipe 36. Kerja masuk jadwal hanya jika sudah bebas constraint — bukan kejar persen palsu.", softwareLabel: "SiapKerja!", softwareUrl: "https://siapkerja-lps.vercel.app", date: "2026-11-14", weekday: "Sabtu", start: "08:00", end: "09:30", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-siapkerja" },
      { id: "rusun-takt", no: 5, title: "Rusun Takt", description: "Rusun tiga lantai, tujuh wagon. Bandingkan push vs JIT dan lihat waiting waste yang tetap dibayar.", softwareLabel: "Rusun Takt", softwareUrl: "https://rusun-takt.vercel.app", date: "2026-12-05", weekday: "Sabtu", start: "08:00", end: "09:30", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-rusun-takt" },
      { id: "mp2k", no: 6, title: "MP2K", description: "Proyek sebagai sistem produksi multimoda: lapangan, near-site, pasokan jauh. Little, Kingman, CONWIP — bukan Gantt yang diperhalus.", softwareLabel: "MP2K", softwareUrl: "https://mp2k.vercel.app", date: "2026-12-19", weekday: "Sabtu", start: "08:00", end: "09:30", teamsUrl: "https://teams.microsoft.com/l/meetup-join/placeholder-mp2k" }
    ]
  };

  var MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  var series = EMBEDDED;

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/\"/g, """);
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

  function softwareLine(s) {
    if (!s.softwareUrl) return "";
    var label = s.softwareLabel ? s.softwareLabel : "buka di peramban";
    return (
      '<p class="session-sw">' +
        '<a class="sw-link" href="' + escapeHtml(s.softwareUrl) + '" target="_blank" rel="noopener">' +
          "Software gratis · " + escapeHtml(label) +
        "</a>" +
      "</p>"
    );
  }

  function renderSessions() {
    var host = $("sessions");
    var html = "";
    for (var i = 0; i < series.sessions.length; i++) {
      var s = series.sessions[i];
      html +=
        '<label class="session" data-id="' + s.id + '">' +
          '<input type="checkbox" name="sesi" value="' + s.id + '">' +
          "<span>" +
            '<p class="session-title"><span class="session-no">' + pad(s.no) + "</span> " + escapeHtml(s.title) + "</p>" +
            '<p class="session-when">' + escapeHtml(formatWhen(s)) + "</p>" +
            (s.description ? '<p class="session-desc">' + escapeHtml(s.description) + "</p>" : "") +
            softwareLine(s) +
          "</span>" +
        "</label>";
    }

    host.innerHTML = html;
    host.addEventListener("change", syncSessionClass);
    var links = host.querySelectorAll(".sw-link");
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener("click", function (ev) {
        ev.stopPropagation();
      });
    }
  }

  function syncSessionClass() {
    var labels = document.querySelectorAll(".session");
    for (var i = 0; i < labels.length; i++) {
      var box = labels[i].querySelector("input");
      labels[i].classList.toggle("is-on", box && box.checked);
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

  /* WIB = UTC+7; 08:00–09:30 WIB = 01:00–02:30 UTC */
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
        (s.description ? s.description + "\n\n" : "") +
        (s.softwareUrl ? "Software simulasi (gratis, tanpa instalasi):\n" + s.softwareUrl + "\n\n" : "") +
        "Tautan Microsoft Teams:\n" + s.teamsUrl + "\n\n" +
        "Untuk: " + person.nama + " (" + person.email + "), " + person.instansi + "\n" +
        "Tidak ada email konfirmasi. Impor acara ini ke kalender Anda untuk masuk ke sesi.";

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
      "<h2>Anda sudah terdaftar, " + escapeHtml(person.nama) + ".</h2>" +
      "<p>Sesi berikut sudah tercatat untuk Anda.</p>" +
      "<ul>" + items + "</ul>" +
      "<p>Kalender sudah diunduh. Impor ke Outlook, Google Kalender, atau Apple Kalender. Tautan Microsoft Teams ada di acara itu.</p>" +
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
    var btn = $("submit");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Mencatat…";
    }
    var payload = {
      timestamp: new Date().toISOString(),
      nama: person.nama,
      email: person.email,
      instansi: person.instansi,
      sesiIds: person.sessions.join(","),
      sesiJudul: chosen.map(function (s) { return s.title; }).join(", ")
    };
    fetch("/api/daftar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .catch(function () { return null; })
      .then(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Daftar dan unduh kalender";
        }
        downloadIcs(buildIcs(chosen, person));
        showThanks(person, chosen);
      });
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
