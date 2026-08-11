import { Valthera } from "@wxn0brp/db/valthera";
import { convertIdToUnix } from "@wxn0brp/db-core";
import { $ } from "bun";
import { Evt } from "./types";

export const db = new Valthera("data");

export async function start(name: string) {
	return await db.add<Evt>({
		collection: name,
		data: {},
	});
}

export async function stop(name: string) {
	return await db.updateOne<Evt>({
		collection: name,
		search: {
			$not: {
				$exists: {
					end: true,
				},
			},
		},
		updater: {
			end: Date.now(),
		},
	});
}

export async function getData(name: string) {
	const data = await db.find<Evt>({
		collection: name,
	});
	return data.map(x => {
		x.start = convertIdToUnix(x._id);
		return x;
	});
}

export function notify(msg: string) {
	$`notify-send "ChronoK" "${msg}"`;
}

export async function toggle(name: string, notifyEnabled = true) {
	const updated = await stop(name);
	if (notifyEnabled) notify(updated ? "-" : "+");
	if (updated) {
		return {
			ended: updated,
		};
	} else {
		return await start(name);
	}
}

export function formatTime(ms: number) {
	const hours = ms / (60 * 60 * 1000);
	const minutes = (ms / (60 * 1000)) % 60;
	const seconds = (ms / 1000) % 60;

	const hoursStr = hours >= 1 ? `${Math.floor(hours)}h` : "";
	const minutesStr = minutes >= 1 ? `${Math.floor(minutes)}m` : "";
	const secondsStr = seconds >= 1 ? `${Math.floor(seconds)}s` : "";

	return `${hoursStr} ${minutesStr} ${secondsStr}`.trim();
}
