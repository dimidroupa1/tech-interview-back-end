import express from "express";
import {
  deleteArticle,
  editArticle,
  getAllArticles,
  getArticleById,
  uploadArticle,
} from "../controllers/article.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const articleRouter = express.Router();

articleRouter.post(
  "/create-article",
  isAutheticated,
  authorizeRoles("admin"),
  uploadArticle
);
articleRouter.put(
  "/edit-article",
  isAutheticated,
  authorizeRoles("admin"),
  editArticle
);
articleRouter.get("/get-all-articles", getAllArticles);
articleRouter.get("/get-article/:id", getArticleById);
articleRouter.delete(
  "/delete-article/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteArticle
);

export default articleRouter;
