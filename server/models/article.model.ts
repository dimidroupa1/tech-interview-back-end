import mongoose, { Document, model, Model, Schema } from "mongoose";
import { IUser, userSchema } from "./user.model";

export type ISubArticle = {
  title: string;
  text: string;
};

export type IArticle = {
  title: string;
  subArticle: ISubArticle[];
  image: {
    public_id: string;
    url: string;
  };
  keywords: string[];
};

const subArtcileSchema = new Schema<ISubArticle>({
  title: String,
  text: String,
});

const articleSchema = new Schema<IArticle>(
  {
    title: String,
    subArticle: [subArtcileSchema],
    image: {
      public_id: String,
      url: String,
    },
    keywords: [String],
  },
  { timestamps: true }
);

const ArticleModel: Model<IArticle> = mongoose.model("Article", articleSchema);

export default ArticleModel;
