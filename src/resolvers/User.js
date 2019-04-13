const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(x => {
      return x.poster === parent.id;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(x => {
      return x.commentor === parent.id;
    });
  }
};

export { User as default };
