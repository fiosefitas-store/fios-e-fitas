import "server-only";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var _prismaClientInstance: PrismaClient | undefined;
}

function createPrisma() {
  const client = new PrismaClient({ log: ["error", "warn"] });
  if (process.env.NODE_ENV !== "production") global._prismaClientInstance = client;
  return client;
}

let clientInstance: PrismaClient | undefined = global._prismaClientInstance;

const lazyHandler: ProxyHandler<any> = {
  get(_target, prop) {
    if (!clientInstance) clientInstance = createPrisma();
    // @ts-ignore
    return (clientInstance as any)[prop];
  },
  apply(_target, thisArg, args) {
    if (!clientInstance) clientInstance = createPrisma();
    // @ts-ignore
    return (clientInstance as any).apply(thisArg, args);
  },
};

export const prisma = new Proxy({}, lazyHandler) as unknown as PrismaClient;