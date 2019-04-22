import getUserID from "../Utils/getUserID";

const User = {
  email: {
    fragment: "fragment userId on User { id } ",
    resolve(parent, args, { request, prisma }, info) {
      const userId = getUserID(request);
      if (userId && userId === parent.id) {
        return parent.email;
      }
      return null;
    }
  },

  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          author: {
            id: parent.id
          }
        }
      });
    }
  }
};

export { User as default };
