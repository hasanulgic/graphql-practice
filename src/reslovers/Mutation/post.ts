import { checkUserAccess } from "../../utils/checkUserAccess";

export const postResolvers = {
  addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    console.log(userInfo);
    if (!userInfo) {
      return {
        postError: "UnAuthorized",
        post: null,
      };
    }

    if (!post.title && !post.content) {
      return {
        postError: "Title and Content is required",
        post: null,
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.userId,
      },
    });
    return {
      postError: null,
      post: newPost,
    };
  },
  updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        postError: "UnAuthorized",
        post: null,
      };
    }

    const error = await checkUserAccess(prisma, userInfo.userId, args.postId);

    if (error) {
      return error;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: args.post,
    });

    return {
      postError: "null",
      post: updatedPost,
    };
  },
  publishPost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        postError: "UnAuthorized",
        post: null,
      };
    }

    const error = await checkUserAccess(prisma, userInfo.userId, args.postId);

    if (error) {
      return error;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: {
        published: true
      }
    });

    return {
      postError: "null",
      post: updatedPost,
    };
  },
  deletePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        postError: "UnAuthorized",
        post: null,
      };
    }

    const error = await checkUserAccess(prisma, userInfo.userId, args.postId);

    if (error) {
      return error;
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(args.postId),
      },
    });

    return {
      postError: "null",
      post: deletedPost,
    };
  },
};