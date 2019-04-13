const Comment = {
  commentor(parent, args, { db }, info) {
    return db.users.find(x => {
      return x.id === parent.commentor;
    });
  },
  post(parent, args, { db }, info) {
    return db.posts.find(x => {
      return (x.id = parent.post);
    });
  }
};

export { Comment as default };
