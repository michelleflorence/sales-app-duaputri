import multer from "multer";

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Tentukan folder penyimpanan file, dalam hal ini "uploads/"
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Ambil nama asli file yang diunggah
    const filename = file.originalname;

    // Normalisasi path file dan simpan dalam properti request
    req.normalizedImagePath = filename.replace(/\\\\/g, "\\");

    // Tentukan nama file gambar yang akan disimpan
    cb(null, filename);
  },
});

// Inisialisasi multer dengan menggunakan konfigurasi storage yang telah dibuat
const upload = multer({ storage: storage });

export default upload;
