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
export const getAllArticlesService = async (
  res: Response,
  skip: number,
  limit: number,
  totalPages: number,
  search: string
) => {
  const articles = await ArticleModel.find({
    keywords: { $elemMatch: { $regex: new RegExp(search.toLowerCase(), "i") } },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(201).json({
    success: true,
    articles,
    totalPages,
  });
};

export const countAllArticlesService = async () => {
  return await ArticleModel.countDocuments();
};
