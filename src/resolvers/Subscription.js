const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
      //   const post = db.posts.find(x => x.id === postId && x.published === true);
      //   if (!post) {
      //     throw new Error("No Post found");
      //   }

      //   return pubsub.asyncIterator(`comment ${postId}`);
      //
    }
  },

  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  }
};

export { Subscription as default };
