export const checkUserAccess = async (prisma: any, userId: any, postId: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      postError: "User not found",
      post: null,
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    return {
      postError: "post not found",
      post: null,
    };
  }

  if (post.authorId !== user.id) {
    return {
      postError: "Post not owned by user",
      post: null,
    };
  }
};