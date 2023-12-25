import multer from "multer";

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname; // Gunakan nama asli file yang diunggah
    req.normalizedImagePath = filename.replace(/\\\\/g, "\\"); // Normalisasi path
    cb(null, filename); // Menentukan nama file gambar
  },
});

const upload = multer({ storage: storage });

export default upload;
