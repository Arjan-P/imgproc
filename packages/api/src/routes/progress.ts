import { type FastifyPluginAsync } from "fastify";
import { type ProgressEvent } from "@imgproc/shared";

export const progressRoute: FastifyPluginAsync = async (app) => {
  app.get("/jobs/:id/progress", async (req, reply) => {
    const { id } = req.params as { id: string };

    // set SSE headers on the raw Node response
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // nginx: disable proxy buffering
    });

    const send = (evt: ProgressEvent) => {
      reply.raw.write(`data: ${JSON.stringify(evt)}\n\n`);
    };

    // poll Redis pub/sub for progress updates from the worker
    const sub = app.redis.duplicate();
    await sub.subscribe(`job:${id}:progress`);

    sub.on("message", (_, msg) => {
      const evt: ProgressEvent = JSON.parse(msg);
      send(evt);
      if (evt.status === "done" || evt.status === "failed") {
        sub.unsubscribe();
        sub.quit();
        reply.raw.end();
      }
    });

    // send initial state immediately so client doesn't wait
    const [row] = await app.db`
      SELECT id, status, progress FROM jobs WHERE id = ${id}
    `;
    if (row) send({ id: row.id, status: row.status, progress: row.progress });

    // clean up if client disconnects
    req.raw.on("close", () => {
      sub.unsubscribe();
      sub.quit();
    });

    return reply;
  });
};
