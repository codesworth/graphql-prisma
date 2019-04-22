import getUserID from "../Utils/getUserID";

const User = {
  email(parent, args, { request, prisma }, info) {
    const userId = getUserID(request);
    if (userId && userId === parent.id) {
      return parent.email;
    }
    return null;
  }
};

export { User as default };
