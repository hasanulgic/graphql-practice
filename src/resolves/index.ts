import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
      const isExist = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      if(isExist){
        return {
          userError: "Already this email is registered",
          token: null
        }
      }

      const hashed = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: {
          ...args,
          password: hashed,
        },
      });

      const token = jwt.sign({ userId: newUser.id }, "signature", {
        expiresIn: "1d",
      });
      return {
        userError: null,
        token,
      };
    },
    signin: async (parent: any, args: any, context: any) => {
      // console.log(args);
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      // console.log(user);
      if (!user) {
        return {
          userError: "User not found",
          token: null,
        };
      }
      const correctPass = await bcrypt.compare(args.password, user.password);
      if (!correctPass) {
        return {
          userError: "Wrong Password provided",
          token: null,
        };
      }
      const token = jwt.sign({ userId: user.id }, "signature", {
        expiresIn: "1d",
      });
      return {
        userError: null,
        token,
      };
    },
  },
};
