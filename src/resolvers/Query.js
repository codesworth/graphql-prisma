const Query = {
  comments(parent, args, { db }, info) {
    return db.comments;
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      };
    }

    return prisma.query.posts(opArgs, info);
  },

  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
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
  }
};

export { Query as default };
