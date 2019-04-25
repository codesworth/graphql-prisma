import getUserID from "../Utils/getUserID";
const Query = {
  comments(parent, args, { db, prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [
          {
            text_contains: args.query
          }
        ]
      };
    }

    return prisma.query.comments(opArgs, info);
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        published: true
      }
    };
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },

  async post(parent, args, { prisma, request }, info) {
    const userId = getUserID(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length == 0) {
      throw new Error("Post not found");
    }

    return posts[0];
  },

  async myposts(parent, args, { prisma, request }, info) {
    const userId = getUserID(request, true);

    const posts = await prisma.query.posts(
      {
        where: {
          author: {
            id: userId
          }
        }
      },
      info
    );

    return posts;
  },
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }
    return prisma.query.users(opArgs, info);
    // console.log(ctx);
    // if (!args.query) {
    //   return ctx.db.users;
    // }
    // return ctx.db.users.filter(x => {
    //   return x.name.toLowerCase().includes(args.query.toLowerCase());
    // });
  },

  async me(parent, args, { prisma, request }, info) {
    const userId = getUserID(request, true);
    console.log("The userId : " + userId);

    const users = await prisma.query.users(
      {
        where: {
          id: userId
        }
      },
      info
    );

    if (users.length == 0) {
      throw new Error("User Not Found");
    }

    return users[0];
  }
};

export { Query as default };
