import FalconFrame, { FFRequest } from "@wxn0brp/falcon-frame";
import { db, getData, notify, start, stop, toggle } from "./utils";

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
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

function getName(req: FFRequest) {
    return req.query.name || CHRONOK_NAME;
}

function getNotify(req: FFRequest) {
    return req.query.notify !== undefined;
}

function run(req: FFRequest, fn: Function, type: string) {
    const name = getName(req);
    if (getNotify(req)) notify(type);
    return fn(name);
}

app.get("/", (req) => getData(getName(req)));
app.get("/start", req => run(req, start, "+"));
app.get("/stop", req => run(req, stop, "-"));
app.get("/toggle", (req) => toggle(getName(req), !getNotify(req)));

app.get("/clear", async (req) => ({ cleared: await db.removeCollection(getName(req)) }));

app.listen(+process.env.CHRONOK_PORT || 56_843, true);