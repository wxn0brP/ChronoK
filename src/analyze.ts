import { Evt } from "./types";
import { formatTime, getData } from "./utils";

function analyze(events: Evt[]) {
    if (!events.length) {
        console.log("No data to analyze");
        return;
    }

    if (events[events.length - 1].end === undefined) {
        events[events.length - 1].end = Date.now();
        console.log("Last event not ended, assuming now");
    }

    const mergedEvents: Evt[] = [];
    if (events.length > 0) {
        mergedEvents.push({ ...events[0] });
        for (let i = 1; i < events.length; i++) {
            const prevEvent = mergedEvents[mergedEvents.length - 1];
            const currentEvent = events[i];
            const gap = currentEvent.start - prevEvent.end;

            if (gap < 5000) {
                prevEvent.end = currentEvent.end;
            } else {
                mergedEvents.push({ ...currentEvent });
            }
        }
    }

    const totalTime = mergedEvents.reduce((sum, e) => sum + (e.end - e.start), 0);

    const avgTime = totalTime / mergedEvents.length;

    const gaps: number[] = [];
    for (let i = 1; i < mergedEvents.length; i++) {
        gaps.push(mergedEvents[i].start - mergedEvents[i - 1].end);
    }

    console.log("Event analysis:");
    console.log("Merged events:\t\t", mergedEvents.length);
    console.log("Events Count:\t\t", events.length);
    console.log("Total time:\t\t", formatTime(totalTime));
    console.log("Average event time:\t", formatTime(avgTime));
    console.log("Gaps between events:\t", gaps.map(formatTime).filter(Boolean).join(", "));
    console.log(
        "Average gap:\t\t",
        gaps.length ? formatTime(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0
    );
}

const data = await getData(process.argv[2] || process.env.CHRONOK_NAME || "ChronoK");
analyze(data);