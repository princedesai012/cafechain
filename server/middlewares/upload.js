const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirectory = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
};

const avatarsDir = path.join(__dirname, "..", "uploads", "avatars");
ensureDirectory(avatarsDir);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, avatarsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname) || ".png";
		const safeName = file.fieldname + "-" + Date.now() + ext;
		cb(null, safeName);
	}
});

const fileFilter = (req, file, cb) => {
	const allowed = ["image/jpeg", "image/png", "image/webp"]; 
	if (allowed.includes(file.mimetype)) return cb(null, true);
	cb(new Error("Only jpeg, png, webp images are allowed"));
};

exports.uploadAvatar = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });


