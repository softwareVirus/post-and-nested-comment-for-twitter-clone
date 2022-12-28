"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbService_1 = require("./dbService");
function listAllPosts(list) {
    let newList = [];
    console.log(list);
    for (let i = 0; i < list.length; i++) {
        newList.push({
            id: list[i].id,
            content: list[i].content,
            date: list[i].updatedAt,
            commentCount: list[i].comments.length,
            thumbsUp: list[i].reactions.filter((item) => item.reactionType === "thumbs up").length,
            thumbsDown: list[i].reactions.filter((item) => item.reactionType === "thumbs down").length,
            heart: list[i].reactions.filter((item) => item.reactionType === "heart")
                .length,
            rocket: list[i].reactions.filter((item) => item.reactionType === "rocket")
                .length,
        });
    }
    console.log(newList);
    return newList;
}
function createFilteredComments(comment) {
    const array = comment.sort(function (a, b) {
        return (a.parentCommentPath.split("/").length -
            b.parentCommentPath.split("/").length);
    });
    console.log(array);
    const answer = [];
    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (array[i].parentCommentPath === "") {
            let reactionCount = [0, 0, 0, 0];
            for (let j = 0; j < array[i].reactions.length; j++) {
                reactionCount[["thumbs up", "thumbs down", "rocket", "heart"].indexOf(array[i].reactions[j].reactionType.toLocaleLowerCase())]++;
            }
            answer.push({
                id: array[i].id,
                content: array[i].content,
                date: array[i].updatedAt,
                children: [],
                reactions: reactionCount,
            });
        }
        else {
            let y = array[i].parentCommentPath
                .split("/")
                .map((item) => Number(item))
                .slice(0, -1);
            if (array[i].parentCommentPath !== "") {
                let x = answer[dbConnection.findIndexOfArray(answer, y[0])];
                for (let j = 1; j < y.length; j++) {
                    x = x.children[dbConnection.findIndexOfArray(x.children, y[j])];
                }
                let reactionCount = [0, 0, 0, 0];
                for (let j = 0; j < array[i].reactions.length; j++) {
                    reactionCount[["thumbs up", "thumbs down", "rocket", "heart"].indexOf(array[i].reactions[j].reactionType.toLocaleLowerCase())]++;
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
const dbConnection = new dbService_1.DBService();
const resolvers = {
    Query: {
        listComments() {
            return createFilteredComments(dbConnection.commentService().find());
        },
        listPosts() {
            return listAllPosts(dbConnection.postService().find(null));
        },
    },
    Mutation: {
        addComment(_, { content, parentPost, parentId, }, __) {
            try {
                if (content.length > 280) {
                    throw new Error("The content must be less than 281");
                }
                let parentCommentPath = parentId === null
                    ? ""
                    : dbConnection.commentService().find(parentId)[0]
                        .parentCommentPath +
                        parentId +
                        "/";
                const comments = dbConnection
                    .commentService()
                    .save(content, parentPost, parentId, parentCommentPath);
                const FilteredComments = createFilteredComments(comments);
                return FilteredComments;
            }
            catch (e) {
                console.log(e);
            }
            return [];
        },
        addPost(_, { content }, __) {
            try {
                if (content.length > 280) {
                    throw new Error("You cannot send a post which has more than 280 characters");
                }
                const newPost = dbConnection.postService().save(content);
                return listAllPosts(dbConnection.postService().find(null));
            }
            catch (e) {
                console.log(e);
            }
            return [];
        },
        addReaction(_, { reactionType, postId, commentId, }, __) {
            if (["thumbs up", "thumbs down", "rocket", "heart"].indexOf(reactionType.toLocaleLowerCase()) === -1 ||
                (postId !== null && commentId !== null)) {
                throw new Error("Enter a valid reaction");
            }
            const newReaction = dbConnection
                .reactionService()
                .save(reactionType, postId, commentId);
            return newReaction;
        },
    },
};
exports.default = resolvers;
