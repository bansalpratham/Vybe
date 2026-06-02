import mongoose from "mongoose";

/* Comment Schema (BEST PRACTICE) */
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // must match User model name
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* Post Schema */
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    media: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema], // ✅ FIXED
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
