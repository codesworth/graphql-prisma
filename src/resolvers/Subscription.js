import getUserID from "../Utils/getUserID";
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
  },

  mypost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserID(request, true);
      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId
              }
            }
          }
        },
        info
      );
    }
  }
};

export { Subscription as default };
