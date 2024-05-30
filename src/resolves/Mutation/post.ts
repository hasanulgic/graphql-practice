
export const postResolvers = {
  addPost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    console.log(userInfo);
    if (!userInfo) {
      return {
        postError: "UnAuthorized",
        post: null,
      };
    }

    if (!args.title && !args.content) {
      return {
        postError: "Title and Content is required",
        post: null,
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: userInfo.userId,
      },
    });
    return {
      postError: null,
      post: newPost,
    };
  },
};