import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserID from "../Utils/getUserID";
import { JWT_SECRET } from "../Utils/Constants";

// const token = jwt.sign({ id: 46 }, "mysecret");
// console.log(token);

// //const decoded = jwt.verify(token, "mysecrets");
// console.log(decoded);

const Mutation = {
  async createUser(parent, args, { db, prisma }, info) {
    // const emailtaken = await prisma.exists.User({ email: args.data.email });
    // if (emailtaken) {
    //   throw new Error("User exist with this email");
    // }

    if (args.data.password.trim().length < 6) {
      throw new Error("Passowrd is not strong enough");
    }

    const password = await bcrypt.hash(args.data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, JWT_SECRET)
    };
  },

  async loginUser(parent, args, { prisma }, info) {
    const { email, password } = args.data;

    const user = await prisma.query.user({
      where: {
        email
      }
    });
    if (!user) {
      throw new Error(`User with email ${email} does not exist`);
    }
    const usePass = user.password;

    const isMatch = await bcrypt.compare(password, usePass);
    console.log(isMatch);
    if (!isMatch) {
      throw new Error("Wrong Email and Password Combination");
    }

    return {
      user,
      token: jwt.sign(
        {
          userId: user.id
        },
        JWT_SECRET
      )
    };
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExist = prisma.exists.User({ id: args.id });

    if (!userExist) {
      throw new Error("User Does not Exist");
    }

    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
    // const index = db.users.findIndex(x => x.id === args.id);
    // if (index < 0) {
    //   throw new Error("User does not exist");
    // }

    // const user = db.users.splice(index, 1);
    // db.posts = db.posts.filter(post => {
    //   const authored = post.poster === args.id;
    //   if (authored) {
    //     db.comments = db.comments.filter(comment => {
    //       return comment.post !== post.id;
    //     });
    //   }
    //   return !authored;
    // });

    // db.comments = db.comments.filter(comment => {
    //   comment.commentor !== args.id;
    // });

    //return user[0];
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserID(request);

    return await prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
    // const user = db.users.find(x => x.id === id);

    // if (!user) {
    //   throw new Error("User Not Found");
    // }

    // if (typeof data.email === "string") {
    //   const emailtaken = db.users.some(x => x.email === data.email);

    //   if (emailtaken) {
    //     throw new Error("Email already in use");
    //   }

    //   user.email = data.email;
    // }

    // if (typeof data.name === "string") {
    //   user.name = data.name;
    // }

    // if (typeof data.age !== "undefined") {
    //   user.age = data.age;
    // }

    //return user;
  },

  async createPost(parent, args, { prisma, request }, info) {
    // const { prisma } = context;
    // const userExist = await prisma.exists.User({ id: args.data.author });

    // if (!userExist) {
    //   throw new Error("User does not Exists");
    // }
    //console.log(context);
    const userId = getUserID(request);
    return await prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );

    // if (!userExist) {
    //   throw new Error("User Not Founds");
    // }

    // const newPost = {
    //   id: uuidv4(),
    //   ...args.data
    // };

    // db.posts.push(newPost);
    // pubsub.publish("post", {
    //   post: {
    //     mutation: "CREATED",
    //     data: newPost
    //   }
    // });
    // return newPost;
  },

  async updatePost(parent, { id, data }, { prisma }, info) {
    const postExist = await prisma.exists.Post({ id: id });
    if (!postExist) {
      throw new Error("Post does not Exist");
    }

    return await prisma.mutation.updatePost(
      {
        where: {
          id: id
        },
        data: data
      },
      info
    );
    // const { title, body, published } = data;
    // const post = db.posts.find(x => x.id === id);
    // const oldPost = { ...post };

    // if (!post) {
    //   throw new Error("Post does not exist");
    // }

    // if (typeof title === "string") {
    //   post.title = title;
    // }

    // if (typeof body === "string") {
    //   post.body = body;
    // }

    // if (typeof published === "boolean") {
    //   post.published = published;
    //   if (oldPost.published && !post.published) {
    //     //Deleted
    //     pubsub.publish("post", {
    //       post: {
    //         mutation: "DELETE",
    //         data: oldPost
    //       }
    //     });
    //   } else if (!oldPost.published && !post.published) {
    //     pubsub.publish("post", {
    //       post: {
    //         mutation: "CREATE",
    //         data: post
    //       }
    //     });
    //   }
    // } else if (post.published) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "UPDATE",
    //       data: post
    //     }
    //   });
    //}

    //return post;
  },

  async deletePost(parent, args, { prisma }, info) {
    return await prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
    // const index = db.posts.findIndex(x => x.id === args.id);

    // if (index === -1) {
    //   throw new Error("Post not Found");
    // }

    // const deletedPosts = db.posts.splice(index, 1)[0];

    // db.comment = db.comments.filter(x => x !== deletedPosts.id);

    // if (deletedPosts.published) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "DELETE",
    //       data: deletedPosts
    //     }
    //   });
    // }

    // return deletedPosts;
  },

  async createComment(parent, args, { prisma }, info) {
    return await prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          commentor: {
            connect: {
              id: args.data.commentor
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
    // const canComment =
    //   db.users.some(x => x.id === args.data.commentor) &&
    //   db.posts.some(x => x.id === args.data.post);
    // if (!canComment) {
    //   throw new Error("Cannot Post comment at this time");
    // }

    // const comment = {
    //   id: uuidv4(),
    //   ...args.data
    // };

    // db.comments.push(comment);
    // pubsub.publish(`comment ${args.data.post}`, {
    //   comment: {
    //     data: comment,
    //     mutation: "CREATED"
    //   }
    // });

    // const index = posts.findIndex(x => x.id === args.post);
    // posts[index].comments.push(comment.id);
    //return comment;
  },

  async updateComment(parent, { id, data }, { prisma }, info) {
    return await prisma.mutation.updateComment(
      {
        where: {
          id: id
        },
        data: {
          ...data
        }
      },
      info
    );

    // const comment = db.comments.find(x => x.id === id);
    // if (!comment) {
    //   throw new Error("Comments do not Exist");
    // }

    // if (typeof data.text === "string") {
    //   comment.text = data.text;
    //   pubsub.publish(`comment ${comment.post}`, {
    //     comment: {
    //       data: comment,
    //       mutation: "UPDATED"
    //     }
    //   });
    // }

    // return comment;
  },

  async deleteComment(parent, args, { prisma }, info) {
    return await prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
    // const index = db.comments.findIndex(c => c.id === args.id);
    // if (index === -1) {
    //   throw new Error("Comment Does not exist");
    // }

    // const deleted = db.comments.splice(index, 1)[0];
    // db.comments = db.comments.filter(x => x.id !== deleted.id);
    // pubsub.publish(`comment ${deleted.post}`, {
    //   comment: {
    //     data: comment,
    //     mutation: "DELETED"
    //   }
    // });

    // return deleted;
  }
};

export { Mutation as default };
