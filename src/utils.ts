import { convertIdToUnix, Valthera } from "@wxn0brp/db";
import { Evt } from "./types";
import { $ } from "bun";

export const db = new Valthera("data");

export async function start(name: string) {
    return await db.add(name, {});
}

export async function stop(name: string) {
    return await db.updateOne(name, { $not: { $exists: { end: true } } }, { end: Date.now() });
}

export async function getData(name: string) {
    const data = await db.find(name);
    return data.map(x => {
        x.start = convertIdToUnix(x._id);
        return x;
    }) as Evt[];
}

export async function notify(msg: string) {
    await $`notify-send "ChronoK" "${msg}"`;
}

export async function toggle(name: string, notifyEnabled = true) {
    const updated = await stop(name);
    if (notifyEnabled) await notify(updated ? "-" : "+");
    if (updated) {
        return { ended: updated };
    } else {
        return await start(name);
    }
}

export function formatTime(ms: number) {
    const hours = ms / (60 * 60 * 1000);
    const minutes = (ms / (60 * 1000)) % 60;
    const seconds = (ms / 1000) % 60;
    const res = `${hours >= 1 ? `${Math.floor(hours)}h` : ""} ${minutes >= 1 ? `${Math.floor(minutes)}m` : ""} ${seconds >= 1 ? `${Math.floor(seconds)}s` : ""}`;
    return res.trim();
}