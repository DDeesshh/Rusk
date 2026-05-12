import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Один каталог для раздачи /uploads и для multer.
 * Приоритет: UPLOADS_DIR → frontend/public/uploads → корень /uploads → backend/uploads
 * (раньше картинки часто лежали в public или в корне, а не в backend/uploads).
 */
function resolveUploadsDir() {
  if (process.env.UPLOADS_DIR) {
    const resolved = path.resolve(process.env.UPLOADS_DIR);
    if (!fs.existsSync(resolved)) {
      fs.mkdirSync(resolved, { recursive: true });
    }
    return resolved;
  }

  const projectRoot = path.join(__dirname, "..", "..");
  const rootUploads = path.join(projectRoot, "uploads");
  const publicUploads = path.join(projectRoot, "frontend", "public", "uploads");
  const backendUploads = path.join(__dirname, "..", "uploads");

  if (fs.existsSync(publicUploads)) {
    return publicUploads;
  }
  if (fs.existsSync(rootUploads)) {
    return rootUploads;
  }
  if (!fs.existsSync(backendUploads)) {
    fs.mkdirSync(backendUploads, { recursive: true });
  }
  return backendUploads;
}

export const uploadsDir = resolveUploadsDir();

const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 40);
    cb(null, `${Date.now()}-${safeBase || "dish"}${ext}`);
  },
});

export const menuImageUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.has(ext)) {
      return cb(new Error("Допустимы только изображения: jpg, png, webp, gif"));
    }
    cb(null, true);
  },
});
