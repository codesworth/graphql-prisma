import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

export { prisma as default };

// const createPostForUser = async (authorID, data) => {
//   const userExist = await prisma.exists.User({
//     id: authorID
//   });

//   if (!userExist) {
//     throw new Error("User Does not Exist");
//   }
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorID
//           }
//         }
//       }
//     },
//     "{id title body published author{name}}"
//   );
//   return post;
// };

// createPostForUser("jug2zt3o000o0841dep2u4o1", {
//   title: "Man on Mission",
//   body: "Golden Fucking State",
//   published: true
// })
//   .then(data => log(data))
//   .catch(e => log(e));

// prisma.exists
//   .Comment({
//     id: "cjug37x0500600841xu5fxbem"
//   })
//   .then(bool => log(bool));

// const updatePost = async (postID, data) => {
//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postID
//       },
//       data
//     },
//     "{id title author{name email}}"
//   );

//   return post;
// };

// const update = updatePost("cjugcc1dq008q0841v5y64hus", {
//   title: "Bitches Be Crazt",
//   body: "They really do be cray at some times",
//   published: false
// })
//   .then(data => log(data))
//   .catch(e => log(e));

// prisma.query.users(null, "{id name email posts{id title}}").then(result => {
//   log(result);
// });

// prisma.query
//   .comments(null, "{ id text commentor{ id name email}}")
//   .then(data => {
//     log(data);
//   });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Kubernetes",
//         body: "Get My Studies at free",
//         published: false,
//         author: {
//           connect: {
//             id: "cjug2zt3o000o0841dep2u4o1"
//           }
//         }
//       }
//     },
//     "{id title published author{id email}}"
//   )
//   .then(result => {
//     log(result);
//     return prisma.query.users(null, "{id name email posts{id title}}");
//   })
//   .then(moreData => {
//     log(moreData);
//   })
//   .catch(err => log(err));

// prisma.mutation
//   .updatePost(
//     {
//       where: {
//         id: "cjug9k3h6006t0841ydbttn2y"
//       },
//       data: {
//         body: "Learn how to use gql and databases",
//         published: false
//       }
//     },
//     "{id body published author{id name}}"
//   )
//   .then(data => {
//     log(data);
//     return prisma.query.posts(null, "{body id author{name}}");
//   })
//   .then(x => {
//     log(x);
//   })
//   .catch(e => {
//     log(e);
//   });

function log(data) {
  console.log(JSON.stringify(data, undefined, 4));
}
