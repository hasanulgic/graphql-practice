
export const postResolvers = {
  addPost: async (parent: any, {post}: any, { prisma, userInfo }: any) => {
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
  updatePost: async (parent: any, args: any, {prisma, userInfo}: any) => {
    if(!userInfo){
      return {
        postError: "UnAuthorized",
        post: null
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.userId
      }
    })

    if(!user) {
      return {
        postError: "User not found",
        post: null,
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: Number(args.postId)
      }
    })

    if(!post) {
      return {
        postError: "post not found",
        post: null
      }
    }
    
    if(post.authorId !== user.id){
      return {
        postError: "Post not owned by user",
        post: null,
      };
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: args.post
    });

    return {
      postError: "null",
      post: updatedPost
    }
  }
};