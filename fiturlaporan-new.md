Konsep UI: Security Report Dashboard
Halaman ini dirancang sebagai pusat kendali untuk laporan keamanan. Tidak ada formulir input
email yang rumit, hanya fokus pada data dan aksi.

1. Struktur Layout
A. Header & Filter Area (Top Bar)
Di bagian paling atas, user harus bisa memilih konteks waktu dengan cepat:
Report Type Toggle: [ Daily ] [ Weekly ] [ Monthly ]
Date/Range Picker:
Jika Daily: Pilih Tanggal (Single Date).
Jika Weekly: Pilih Minggu (Week Picker - misal: "Week 52, 2024").
Jika Monthly: Pilih Bulan (Month Year Picker - misal: "December 2024").
Branch Filter: [ All Branches ] atau drop-down untuk memilih spesifik (e.g., Binus Malang,
Binus Kemanggisan).
B. Executive Summary (Cards)
Di bawah filter, tampilkan 3-4 kartu statistik utama untuk memberikan gambaran cepat
(Snapshot):
Total Detections: Jumlah insiden keamanan.
Emergency Events: Jumlah kejadian prioritas tinggi.
Avg Response Time: Rata-rata waktu satpam merespon.
System Uptime: Persentase sensor yang aktif.
C. Report Preview (Main Content)
Tabel interaktif yang menampilkan isi file Excel yang akan di-generate.
Jangan tampilkan semua baris jika datanya ribuan. Cukup tampilkan 10-20 baris pertama
atau summary per branch.
Kolom: Tanggal, Lokasi/Branch, Sensor ID, Tipe Kejadian, Waktu Respon.
D. Action Area (Sticky / Prominent)
Tombol aksi utama harus terlihat jelas:
1. Download Excel: Untuk mengunduh file .xlsx secara manual ke komputer lokal.
2. Send Email Now: Tombol "Panic Button" atau manual trigger. Jika diklik, sistem akan
mengirim email laporan saat itu juga ke daftar penerima yang ada di .env (berguna jika
cron job macet atau butuh laporan dadakan).

2. User Flow
    1. Admin Masuk: Klik menu "Reports" di sidebar.
    2. Default View: Halaman otomatis menampilkan "Weekly Report" minggu berjalan.
    3. Review: Admin melihat angka di "Executive Summary".
    Oh, ada 5 emergency events minggu ini? -> Admin scroll ke bawah lihat tabel detail.
    4. Action:
    Jika ingin menyimpan arsip: Klik Download Excel.
    Jika bos minta laporan sekarang: Klik Send Email Now.

3. Visual Hierarchy
Primary Color (Action): Biru (Binus Blue) untuk tombol Download/Send.
Alert Color: Merah untuk indikator "Emergency Events" yang tinggi.
Success Color: Hijau untuk indikator "Response Time" yang cepat.