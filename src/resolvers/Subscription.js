const Subscription = {
  comment: {
    subscribe(parent, { postId }, { pubsub, db }, info) {
      const post = db.posts.find(x => x.id === postId && x.published === true);
      if (!post) {
        throw new Error("No Post found");
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },

  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    }
  }
};

export { Subscription as default };
