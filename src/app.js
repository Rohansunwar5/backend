import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import categoryRouter from "./routes/category.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"
import collectionRouter from "./routes/collection.routes.js"
import bannerRouter from "./routes/banner.routes.js"
import blogRouter from "./routes/blog.routes.js"
import cloudinaryRouter from "./routes/cloudinary.routes.js"
import couponRouter from "./routes/coupon.routes.js"
import giftCardsRouter from "./routes/giftCards.routes.js"
import occasionsRouter from "./routes/occasions.routes.js"
import reelsRouter from "./routes/reel.routes.js"
import storesRouter from "./routes/stores.routes.js"
import subCategoryRouter from "./routes/subCategories.routes.js"
import testimonialRouter from "./routes/testimonials.routes.js"
import voucherRouter from "./routes/vouchers.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ],
    credentials: true,
}));

app.use(express.json({ limit: "50mb" }));

// app.use(errorHandler);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

/* Routes */

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/banners", bannerRouter);
app.use("/api/v1/banners", blogRouter);
app.use("/api/v1/banners", cloudinaryRouter);
app.use("/api/v1/banners", couponRouter);
app.use("/api/v1/banners", giftCardsRouter);
app.use("/api/v1/banners", occasionsRouter);
app.use("/api/v1/banners", reelsRouter);
app.use("/api/v1/banners", storesRouter);
app.use("/api/v1/banners", subCategoryRouter);
app.use("/api/v1/banners", testimonialRouter);
app.use("/api/v1/banners", voucherRouter);

export { app };