# Seri Simulasi -- halaman daftar (prototipe)

Antarmuka pendaftaran Seri Simulasi Konstruksi Ramping (IAMKRI).

Hanya HTML, CSS, dan JavaScript.

Tanpa proses build. Vanilla saja.

Buka index.html langsung di peramban. Berkas lokal sudah cukup.
series.json dipakai lewat HTTP. Jika file://, data sesi ada di app.js.

## Yang terjadi saat daftar

1. Nama, email, instansi, dan minimal satu sesi divalidasi di peramban.
2. Kalender gabungan .ics diunduh (VEVENT per sesi, Asia/Jakarta dan UTC).
3. Halaman publik tidak menampilkan rekap dan tidak bisa menghapus data.

Rekap dan penghapusan baris hanya di Excel OneDrive (akun Muhamad Abduh):
KERJAAN / IAMKRI / Workshop Simulasi / Pendaftaran Seri Simulasi.xlsx

Tautan Teams di series.json masih placeholder.

## Langkah berikutnya

Power Automate menerima isian, menulis Excel di OneDrive, lalu surel dari abduh@itb.ac.id.
Tautan Teams yang sama seperti di kalender.
