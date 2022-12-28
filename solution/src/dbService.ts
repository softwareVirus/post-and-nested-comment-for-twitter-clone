import { error } from "console";
import * as fs from "fs";

type Nullable<T> = T | null;

interface FunctionInput {
  save: Function;
  find: Function;
}

interface Reaction {
  id: number;
  reactionType: string;
  createdAt: string;
  postId: Nullable<number>;
  commentId: Nullable<number>;
}

interface Comment {
  id: number;
  content: string;
  updatedAt: string;
  createdAt: string;
  parentCommentId: Nullable<number>;
  postId: number;
  reactions: Reaction[];
  parentCommentPath: string;
}

interface Post {
  id: number;
  content: string;
  updatedAt: string;
  createdAt: string;
  comments: Comment[];
  reactions: Reaction[];
}

export class DBService {
  private postID: number = 1;
  private commentID: number = 1;
  private reactionID: number = 1;
  private posts: Post[];
  private comments: Comment[];
  private reactions: Reaction[];
  public constructor() {
    this.posts = [];
    this.comments = [];
    this.reactions = [];
  }
  public findIndexOfArray(array: any[], id: Nullable<number>): number {
    try {
      if (id === null) {
        throw new Error("Enter a valid id");
      }
      const arrayFilterById: number[] = array.map((item) => item.id);
      const findIndexOfArray: number = arrayFilterById.indexOf(id);
      if (findIndexOfArray === -1) {
        throw new Error("Array index error");
      }
      return findIndexOfArray;
    } catch (e) {
      return -1;
    }
  }
  public postService(): FunctionInput {
    return {
      save: (content: string): Post => {
        const newPost: Post = {
          id: this.postID,
          content: content,
          updatedAt: new Date().toString(),
          createdAt: new Date().toString(),
          comments: [],
          reactions: [],
        };
        this.posts.push(newPost);
        this.postID++;
        return newPost;
      },
      find: (id: Nullable<number>): Post[] => {
        try {
          if (id === null) {
            return this.posts;
          } else if (id !== undefined) {
            const indexPost = this.findIndexOfArray(this.posts, id);
            if (indexPost === -1) {
              throw new Error("The post is not exist by id");
            }
            return [this.posts[indexPost]];
          } else {
            throw new Error("Id is not valid");
          }
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    };
  }
  public commentService(): FunctionInput {
    return {
      save: (
        content: string,
        parentPost: number,
        parentId: Nullable<number>,
        parentCommentPath: string
      ): Nullable<Comment[]> => {
        try {
          const indexPost = this.findIndexOfArray(this.posts, parentPost);
          if (indexPost === -1) {
            throw new Error("The post or comment is not exist by id");
          }
          const newComment: Comment = {
            id: this.commentID,
            content: content,
            updatedAt: new Date().toString(),
            createdAt: new Date().toString(),
            parentCommentId: parentId,
            postId: parentPost,
            reactions: [],
            parentCommentPath: parentCommentPath,
          };
          this.commentID++;
          this.comments.push(newComment);
          return this.comments;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
      find: (id: Nullable<number>): Comment[] => {
        console.log(id);
        try {
          if (id === null) {
            this.comments;
          } else if (id !== undefined) {
            const indexComment = this.findIndexOfArray(this.comments, id);
            if (indexComment === -1) {
              throw new Error("The comment is not exist by id");
            }
            return [this.comments[indexComment]];
          } else {
            throw new Error("Id is not valid");
            return [];
          }
          return [];
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    };
  }
  public reactionService(): FunctionInput {
    return {
      save: (
        reactionType: string,
        postId: Nullable<number>,
        commentId: Nullable<number>
      ): Nullable<Reaction> => {
        try {
          if (postId === null && commentId === null) {
            throw new Error("postId and commentId is invalid");
          }
          const newReaction: Reaction = {
            id: this.reactionID,
            reactionType,
            createdAt: new Date().toString(),
            postId,
            commentId,
          };
          if (postId === null) {
            const commentIdIndex = this.findIndexOfArray(
              this.comments,
              commentId
            );
            this.comments[commentIdIndex].reactions.push(newReaction);
          } else {
            const postIdIndex = this.findIndexOfArray(this.posts, postId);
            this.posts[postIdIndex].reactions.push(newReaction);
          }
          this.reactionID++;
          return newReaction;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
      find: (id: Nullable<number>): Reaction[] => {
        try {
          if (id === null) {
            this.reactions;
          } else if (id) {
            const indexReaction = this.findIndexOfArray(this.reactions, id);
            if (indexReaction === -1) {
              throw new Error("The comment is not exist by id");
            }
            return [this.reactions[indexReaction]];
          } else {
            throw new Error("Id is not valid");
          }
          return [];
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    };
  }
}
