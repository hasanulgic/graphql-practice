import { userLoader } from "../dataLoaders/userLoader";

export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: any) => {
    return userLoader.load(parent.authorId);
    
    // previsous data before optimization using laoder data
    return await prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};
