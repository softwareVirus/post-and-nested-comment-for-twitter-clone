import { DBService } from "./dbService";

type Nullable<T> = T | null;

interface Reaction {
  id: number;
  reactionType: string;
  createdAt: string;
  postId: Nullable<number>;
  commentId: Nullable<number>;
}

interface ReturnedComment {
  id: number;
  content: string;
  updatedAt: string;
  createdAt: string;
  parentCommentId: Nullable<number>;
  postId: number;
  reactions: Reaction[];
  parentCommentPath: string;
}

interface Comment {
  id: number;
  content: string;
  date: string;
  children: Comment[];
  reactions: number[];
}

interface Post {
  id: number;
  content: string;
  date: string;
  commentCount: Nullable<number>;
  thumbsUp: Nullable<number>;
  thumbsDown: Nullable<number>;
  rocket: Nullable<number>;
  heart: Nullable<number>;
}

interface RemovedPost {
  id: number;
  content: string;
  updatedAt: string;
  createdAt: string;
  comments: Comment[];
  reactions: Reaction[];
}

function listAllPosts(list: RemovedPost[]): Post[] {
  let newList: Post[] = [];
  console.log(list);
  for (let i: number = 0; i < list.length; i++) {
    newList.push({
      id: list[i].id,
      content: list[i].content,
      date: list[i].updatedAt,
      commentCount: list[i].comments.length,
      thumbsUp: list[i].reactions.filter(
        (item) => item.reactionType === "thumbs up"
      ).length,
      thumbsDown: list[i].reactions.filter(
        (item) => item.reactionType === "thumbs down"
      ).length,
      heart: list[i].reactions.filter((item) => item.reactionType === "heart")
        .length,
      rocket: list[i].reactions.filter((item) => item.reactionType === "rocket")
        .length,
    });
  }
  console.log(newList);
  return newList;
}

function createFilteredComments(comment: ReturnedComment[]): Comment[] {
  const array: ReturnedComment[] = comment.sort(function (
    a: ReturnedComment,
    b: ReturnedComment
  ) {
    return (
      a.parentCommentPath.split("/").length -
      b.parentCommentPath.split("/").length
    );
  });
  console.log(array);
  const answer: Comment[] = [];

  for (let i: number = 0; i < array.length; i++) {
    console.log(array[i]);
    if (array[i].parentCommentPath === "") {
      let reactionCount: number[] = [0, 0, 0, 0];
      for (let j: number = 0; j < array[i].reactions.length; j++) {
        reactionCount[
          ["thumbs up", "thumbs down", "rocket", "heart"].indexOf(
            array[i].reactions[j].reactionType.toLocaleLowerCase()
          )
        ]++;
      }
      answer.push({
        id: array[i].id,
        content: array[i].content,
        date: array[i].updatedAt,
        children: [],
        reactions: reactionCount,
      });
    } else {
      let y: number[] = array[i].parentCommentPath
        .split("/")
        .map((item) => Number(item))
        .slice(0, -1);
      if (array[i].parentCommentPath !== "") {
        let x: Comment = answer[dbConnection.findIndexOfArray(answer, y[0])];
        for (let j = 1; j < y.length; j++) {
          x = x.children[dbConnection.findIndexOfArray(x.children, y[j])];
        }
        let reactionCount: number[] = [0, 0, 0, 0];
        for (let j: number = 0; j < array[i].reactions.length; j++) {
          reactionCount[
            ["thumbs up", "thumbs down", "rocket", "heart"].indexOf(
              array[i].reactions[j].reactionType.toLocaleLowerCase()
            )
          ]++;
        }
        x.children.push({
          id: array[i].id,
          content: array[i].content,
          date: array[i].updatedAt,
          children: [],
          reactions: reactionCount,
        });
        console.log(x);
      }
    }
  }
  return answer;
}

const dbConnection = new DBService();

const resolvers = {
  Query: {
    listComments(): Comment[] {
      return createFilteredComments(dbConnection.commentService().find());
    },
    listPosts(): Post[] {
      return listAllPosts(dbConnection.postService().find(null));
    },
  },
  Mutation: {
    addComment(
      _: any,
      {
        content,
        parentPost,
        parentId,
      }: {
        content: string;
        parentPost: number;
        parentId: Nullable<number>;
      },
      __: any
    ): Comment[] {
      try {
        if (content.length > 280) {
          throw new Error("The content must be less than 281");
        }
        let parentCommentPath: string =
          parentId === null
            ? ""
            : dbConnection.commentService().find(parentId)[0]
                .parentCommentPath +
              parentId +
              "/";
        const comments: ReturnedComment[] = dbConnection
          .commentService()
          .save(content, parentPost, parentId, parentCommentPath);
        const FilteredComments = createFilteredComments(comments);
        return FilteredComments;
      } catch (e) {
        console.log(e);
      }
      return [];
    },
    addPost(_: any, { content }: { content: string }, __: any): Post[] {
      try {
        if (content.length > 280) {
          throw new Error(
            "You cannot send a post which has more than 280 characters"
          );
        }
        const newPost = dbConnection.postService().save(content);
        return listAllPosts(dbConnection.postService().find(null));
      } catch (e) {
        console.log(e);
      }
      return [];
    },
    addReaction(
      _: any,
      {
        reactionType,
        postId,
        commentId,
      }: {
        reactionType: string;
        postId: Nullable<number>;
        commentId: Nullable<number>;
      },
      __: any
    ): Reaction {
      if (
        ["thumbs up", "thumbs down", "rocket", "heart"].indexOf(
          reactionType.toLocaleLowerCase()
        ) === -1 ||
        (postId !== null && commentId !== null)
      ) {
        throw new Error("Enter a valid reaction");
      }
      const newReaction = dbConnection
        .reactionService()
        .save(reactionType, postId, commentId);
      return newReaction;
    },
  },
};

export default resolvers;
