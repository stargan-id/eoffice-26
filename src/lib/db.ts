import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prismaDbHonorarium: PrismaClient | undefined;
}

// Use 'globalThis' instead of 'global'
export const db = globalThis.prismaDbHonorarium || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  // Use 'globalThis' instead of 'global'
  globalThis.prismaDbHonorarium = db;
}

export { Prisma };
