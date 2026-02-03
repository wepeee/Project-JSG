import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { adminUsersRouter } from "./routers/superadmin/users";
import { machinesRouter } from "./routers/superadmin/machines";
import { materialsRouter } from "./routers/ppic/materials";
import { processesRouter } from "./routers/ppic/processes";
import { prosRouter } from "./routers/ppic/pros";
import { productionRouter } from "./routers/operator/production";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  adminUsers: adminUsersRouter,
  machines: machinesRouter,
  materials: materialsRouter,
  processes: processesRouter,
  pros: prosRouter,
  production: productionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
