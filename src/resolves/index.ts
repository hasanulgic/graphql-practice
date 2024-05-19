import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface userInfo {
  name: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: userInfo, context: any) => {
      console.log(args);
      const hashed = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: {
          ...args,
          password: hashed,
        },
      });

      const token = jwt.sign({userId: newUser.id}, "signature", {expiresIn: "1d"})
      console.log(token)
    },
  },
};
