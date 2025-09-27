import FalconFrame from "@wxn0brp/falcon-frame";
import { db, getData, start, stop, toggle } from "./utils";

let CHRONOK_NAME = "";

let firstArg = process.argv[2];

if (firstArg) {
    CHRONOK_NAME = firstArg;
} else if (process.env.CHRONOK_NAME) {
    CHRONOK_NAME = process.env.CHRONOK_NAME;
} else {
    const date = new Date();
    CHRONOK_NAME = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}_${date.getMinutes()}`;
}

console.log(`CHRONOK_NAME: ${CHRONOK_NAME}`);

const app = new FalconFrame();

function getName(req: any) {
    return req.query.name || CHRONOK_NAME;
}

app.get("/", (req) => getData(getName(req)));
app.get("/start", (req) => start(getName(req)));
app.get("/stop", async (req) => ({ ended: await stop(getName(req)) }));
app.get("/toggle", (req) => toggle(getName(req), req.query.notify === "false" ? false : true));
app.get("/clear", async (req) => ({ cleared: await db.removeCollection(getName(req)) }));

app.listen(+process.env.CHRONOK_PORT || 56_843, true);