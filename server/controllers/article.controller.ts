import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHendler";
import cloudinary from "cloudinary";
import ejs from "ejs";

import ArticleModel, { IArticle } from "../models/article.model";
import { redis } from "../utils/redis";
import { IUser } from "../models/user.model";
import {
  createArticle,
  getAllArticlesService,
} from "../services/article.service";

type IUserRequest = Request & {
  user?: IUser;
};

// upload article
type IArticleBody = IArticle & {
  newImage: string;
};

const dropDuplicateIndex = async () => {
  try {
    await ArticleModel.collection.dropIndex("comments.user.email_1");
    console.log("Index 'comments.user.email_1' dropped successfully");
  } catch (error: any) {
    if (error.code === 27) {
      console.log("Index 'comments.user.email_1' does not exist");
    } else {
      console.error("Error deleting index:", error);
    }
  }
};

export const uploadArticle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await dropDuplicateIndex();

      const data = req.body;
      const image = data.image;

      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "articles",
      });

      data.image = {
        public_id: myCloud.public_id,
        url: myCloud.url,
      };

      createArticle(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit article
export const editArticle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const image = data.image;

      if (image) {
        await cloudinary.v2.uploader.destroy(image.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "articles",
        });

        data.image = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }

      const articleId = req.params.id;

      const article = await ArticleModel.findByIdAndUpdate(
        articleId,
        {
          $set: data,
        },
        {
          new: true,
        }
      );

      res.status(201).json({
        success: true,
        article,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all articles
export const getAllArticles = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllArticlesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get article by id
export const getArticleById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articleId = req.params.id;

      const article = await ArticleModel.findById(articleId)

      if (!article) return next(new ErrorHandler("Article not found", 400));

      res.status(200).json({
        success: true,
        article,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete article --only for admin
export const deleteArticle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const article = await ArticleModel.findById(id);

      if (!article) return next(new ErrorHandler("Article not found", 400));

      await article.deleteOne({ id });

      res.status(200).json({
        success: true,
        message: "Article deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);