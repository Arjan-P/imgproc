import fp from "fastify-plugin";

import { closeQueues } from "../queue/queue.factory.js";

export const queuePlugin = fp(async (app) => {
  app.addHook("onClose", async () => {
    await closeQueues();
  });
});
