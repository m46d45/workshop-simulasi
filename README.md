# Seri Simulasi -- halaman daftar

Antarmuka pendaftaran Seri Simulasi Konstruksi Ramping (IAMKRI).

Hanya HTML, CSS, dan JavaScript.

Tanpa proses build. Vanilla saja.

Buka index.html langsung di peramban. Berkas lokal sudah cukup.
series.json dipakai lewat HTTP. Jika file://, data sesi ada di app.js.

## Yang terjadi saat daftar

1. Nama, email, instansi, dan minimal satu sesi divalidasi di peramban.
2. Pendaftar tercatat di halaman. Tidak ada email konfirmasi.
3. Kalender gabungan .ics diunduh (VEVENT per sesi, tautan Teams di acara).
4. Halaman publik tidak menampilkan rekap dan tidak bisa menghapus data.

Rekap dan penghapusan baris hanya di Excel OneDrive (akun Muhamad Abduh):
KERJAAN / IAMKRI / Workshop Simulasi / Pendaftaran Seri Simulasi.xlsx

Tautan Teams di series.json masih placeholder.
