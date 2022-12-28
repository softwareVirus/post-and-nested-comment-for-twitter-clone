"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBService = void 0;
class DBService {
    postID = 1;
    commentID = 1;
    reactionID = 1;
    posts;
    comments;
    reactions;
    constructor() {
        this.posts = [];
        this.comments = [];
        this.reactions = [];
    }
    findIndexOfArray(array, id) {
        try {
            if (id === null) {
                throw new Error("Enter a valid id");
            }
            const arrayFilterById = array.map((item) => item.id);
            const findIndexOfArray = arrayFilterById.indexOf(id);
            if (findIndexOfArray === -1) {
                throw new Error("Array index error");
            }
            return findIndexOfArray;
        }
        catch (e) {
            return -1;
        }
    }
    postService() {
        return {
            save: (content) => {
                const newPost = {
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
            find: (id) => {
                try {
                    if (id === null) {
                        return this.posts;
                    }
                    else if (id !== undefined) {
                        const indexPost = this.findIndexOfArray(this.posts, id);
                        if (indexPost === -1) {
                            throw new Error("The post is not exist by id");
                        }
                        return [this.posts[indexPost]];
                    }
                    else {
                        throw new Error("Id is not valid");
                    }
                }
                catch (e) {
                    console.log(e);
                    return [];
                }
            },
        };
    }
    commentService() {
        return {
            save: (content, parentPost, parentId, parentCommentPath) => {
                try {
                    const indexPost = this.findIndexOfArray(this.posts, parentPost);
                    if (indexPost === -1) {
                        throw new Error("The post or comment is not exist by id");
                    }
                    const newComment = {
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
                }
                catch (e) {
                    console.log(e);
                    return null;
                }
            },
            find: (id) => {
                console.log(id);
                try {
                    if (id === null) {
                        this.comments;
                    }
                    else if (id !== undefined) {
                        const indexComment = this.findIndexOfArray(this.comments, id);
                        if (indexComment === -1) {
                            throw new Error("The comment is not exist by id");
                        }
                        return [this.comments[indexComment]];
                    }
                    else {
                        throw new Error("Id is not valid");
                        return [];
                    }
                    return [];
                }
                catch (e) {
                    console.log(e);
                    return [];
                }
            },
        };
    }
    reactionService() {
        return {
            save: (reactionType, postId, commentId) => {
                try {
                    if (postId === null && commentId === null) {
                        throw new Error("postId and commentId is invalid");
                    }
                    const newReaction = {
                        id: this.reactionID,
                        reactionType,
                        createdAt: new Date().toString(),
                        postId,
                        commentId,
                    };
                    if (postId === null) {
                        const commentIdIndex = this.findIndexOfArray(this.comments, commentId);
                        this.comments[commentIdIndex].reactions.push(newReaction);
                    }
                    else {
                        const postIdIndex = this.findIndexOfArray(this.posts, postId);
                        this.posts[postIdIndex].reactions.push(newReaction);
                    }
                    this.reactionID++;
                    return newReaction;
                }
                catch (e) {
                    console.log(e);
                    return null;
                }
            },
            find: (id) => {
                try {
                    if (id === null) {
                        this.reactions;
                    }
                    else if (id) {
                        const indexReaction = this.findIndexOfArray(this.reactions, id);
                        if (indexReaction === -1) {
                            throw new Error("The comment is not exist by id");
                        }
                        return [this.reactions[indexReaction]];
                    }
                    else {
                        throw new Error("Id is not valid");
                    }
                    return [];
                }
                catch (e) {
                    console.log(e);
                    return [];
                }
            },
        };
    }
}
exports.DBService = DBService;
