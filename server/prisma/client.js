import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from './generated/prisma/client.js';

export { Prisma, PrismaPg, PrismaClient };

export function createClient (connectionString) {
  const adapter = new PrismaPg({
    connectionString,
  });
  return new PrismaClient({
    adapter
  }).$extends({
    name: 'paginate',
    model: {
      $allModels: {
        async paginate ({ page, perPage, include, ...options }) {
          const take = parseInt(perPage, 10);
          const skip = (parseInt(page, 10) - 1) * take;
          const context = Prisma.getExtensionContext(this);
          const total = await context.count(options);
          const records = await context.findMany({
            ...options,
            include,
            skip,
            take
          });
          return { records, total };
        }
      }
    }
  });
}

export const prisma = createClient(process.env.DATABASE_URL);

export default prisma;
