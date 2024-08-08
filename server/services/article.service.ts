import { Response } from "express";
import ArticleModel from "../models/article.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";

// create article
export const createArticle = CatchAsyncError(
  async (data: any, res: Response) => {
    const article = await ArticleModel.create(data);

    res.status(200).json({
      success: true,
      article,
    });
  }
);

// get all articles
export const getAllArticlesService = async (res: Response) => {
  const articles = await ArticleModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    articles,
  });
};
