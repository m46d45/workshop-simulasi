# Seri Simulasi -- halaman daftar (prototipe)

Antarmuka pendaftaran Seri Simulasi Konstruksi Ramping (IAMKRI).

Hanya HTML, CSS, dan JavaScript.

Tanpa proses build. Vanilla saja.

Buka index.html langsung di peramban. Berkas lokal sudah cukup.
series.json dipakai lewat HTTP. Jika file://, data sesi ada di app.js.

## Yang terjadi saat daftar

1. Nama, email, instansi, dan minimal satu sesi divalidasi di peramban.
2. Baris pendaftaran disimpan di localStorage (tiruan Excel).
3. Kalender gabungan .ics diunduh (VEVENT per sesi, Asia/Jakarta dan UTC).
4. Rekap jumlah per sesi dibaca dari localStorage.

Tautan Teams di series.json masih placeholder.

Excel live (nanti) ada di OneDrive (ITB): KERJAAN / IAMKRI / Workshop Simulasi.

## Langkah berikutnya

Power Automate menerima isian, menulis Excel di OneDrive, lalu surel dari abduh@itb.ac.id.
Tautan Teams yang sama seperti di kalender.
