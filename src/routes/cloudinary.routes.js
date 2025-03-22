import { Router } from "express";
import { deleteAnImage, uploadAnImage } from "../controllers/cloudinary.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { uploadBulkImagesToCloudinary } from "../controllers/image.controller.js";

const router = Router();

router.route("/upload").post(verifyJWT, uploadImages.fields([{ name: "productImages", maxCount: 6 }, { name: "bannerImage", maxCount: 1 }, { name: "bannerElement", maxCount: 1 }, { name: "blogCover", maxCount: 1 }]), uploadAnImage);

router.route("/upload-bulk-images").post(uploadImages.array("images"),uploadBulkImagesToCloudinary);

router.route("/delete").delete(verifyJWT, deleteAnImage);

export default router;