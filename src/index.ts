import FalconFrame from "@wxn0brp/falcon-frame";
import { db, getData, start, stop, toggle } from "./utils";

const firstArg = process.argv[2];
if (firstArg) process.env.CHRONOK_NAME = firstArg;

const app = new FalconFrame();

function getName(req: any) {
    return req.query.name || process.env.CHRONOK_NAME || "ChronoK";
}

app.get("/", (req) => getData(getName(req)));
app.get("/start", (req) => start(getName(req)));
app.get("/stop", async (req) => ({ ended: await stop(getName(req)) }));
app.get("/toggle", (req) => toggle(getName(req), req.query.notify === "false" ? false : true));
app.get("/clear", async (req) => ({ cleared: await db.removeCollection(getName(req)) }));

app.listen(+process.env.CHRONOK_PORT || 56_843, true);