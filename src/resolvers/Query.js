const Query = {
  me() {
    return {
      id: "msnsmdnkdksdm",
      name: "Jerry Poona",
      age: 45,
      email: "Addon Save"
    };
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },

  posts(parent, args, { db }, info) {
    return db.posts;
  },

  users(parent, args, ctx, info) {
    console.log(ctx);
    if (!args.query) {
      return ctx.db.users;
    }
    return ctx.db.users.filter(x => {
      return x.name.toLowerCase().includes(args.query.toLowerCase());
    });
  }
};

export { Query as default };
