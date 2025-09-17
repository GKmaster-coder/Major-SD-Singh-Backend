import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express()

app.use((cors({
    origin: process.env.COURS_ORIGIN,
    credentials: true
})
))

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());


// Routes
app.use("/api/auth",authRoutes);
app.use("/api/files",fileRoutes);


// Error handler
app.use(errorMiddleware);

export { app }