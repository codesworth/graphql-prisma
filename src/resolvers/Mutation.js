import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    console.log(args);
    const emailtaken = db.users.some(x => x.email === args.email);
    if (emailtaken) {
      throw new Error("Email is already taken");
    }

    const user = {
      id: uuidv4(),
      ...args.data
    };

    db.users.push(user);

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const index = db.users.findIndex(x => x.id === args.id);
    if (index < 0) {
      throw new Error("User does not exist");
    }

    const user = db.users.splice(index, 1);
    db.posts = db.posts.filter(post => {
      const authored = post.poster === args.id;
      if (authored) {
        db.comments = db.comments.filter(comment => {
          return comment.post !== post.id;
        });
      }
      return !authored;
    });

    db.comments = db.comments.filter(comment => {
      comment.commentor !== args.id;
    });

    return user[0];
  },

  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(x => x.id === id);

    if (!user) {
      throw new Error("User Not Found");
    }

    if (typeof data.email === "string") {
      const emailtaken = db.users.some(x => x.email === data.email);

      if (emailtaken) {
        throw new Error("Email already in use");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some(x => x.id === args.data.poster);
    if (!userExist) {
      throw new Error("User Not Founds");
    }

    const newPost = {
      id: uuidv4(),
      ...args.data
    };

    db.posts.push(newPost);
    pubsub.publish("post", {
      post: {
        mutation: "CREATED",
        data: newPost
      }
    });
    return newPost;
  },

  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const { title, body, published } = data;
    const post = db.posts.find(x => x.id === id);
    const oldPost = { ...post };

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (typeof title === "string") {
      post.title = title;
    }

    if (typeof body === "string") {
      post.body = body;
    }

    if (typeof published === "boolean") {
      post.published = published;
      if (oldPost.published && !post.published) {
        //Deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETE",
            data: oldPost
          }
        });
      } else if (!oldPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATE",
            data: post
          }
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATE",
          data: post
        }
      });
    }

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const index = db.posts.findIndex(x => x.id === args.id);

    if (index === -1) {
      throw new Error("Post not Found");
    }

    const deletedPosts = db.posts.splice(index, 1)[0];

    db.comment = db.comments.filter(x => x !== deletedPosts.id);

    if (deletedPosts.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETE",
          data: deletedPosts
        }
      });
    }

    return deletedPosts;
  },

  createComment(parent, args, { pubsub, db }, info) {
    const canComment =
      db.users.some(x => x.id === args.data.commentor) &&
      db.posts.some(x => x.id === args.data.post);
    if (!canComment) {
      throw new Error("Cannot Post comment at this time");
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        data: comment,
        mutation: "CREATED"
      }
    });

    // const index = posts.findIndex(x => x.id === args.post);
    // posts[index].comments.push(comment.id);
    return comment;
  },

  updateComment(parent, { id, data }, { db }, info) {
    const comment = db.comments.find(x => x.id === id);
    if (!comment) {
      throw new Error("Comments do not Exist");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          data: comment,
          mutation: "UPDATED"
        }
      });
    }

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const index = db.comments.findIndex(c => c.id === args.id);
    if (index === -1) {
      throw new Error("Comment Does not exist");
    }

    const deleted = db.comments.splice(index, 1)[0];
    db.comments = db.comments.filter(x => x.id !== deleted.id);
    pubsub.publish(`comment ${deleted.post}`, {
      comment: {
        data: comment,
        mutation: "DELETED"
      }
    });

    return deleted;
  }
};

export { Mutation as default };
