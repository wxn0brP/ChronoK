import { Evt } from "./types";
import { formatTime, getData } from "./utils";



function analyze(events: Evt[]) {
    if (!events.length) {
        console.log("No data to analyze");
        return;
    }

    const totalTime = events.reduce((sum, e) => sum + (e.end - e.start), 0);

    const avgTime = totalTime / events.length;

    const gaps: number[] = [];
    for (let i = 1; i < events.length; i++) {
        gaps.push(events[i].start - events[i - 1].end);
    }

    console.log("Event analysis:");
    console.log("Number of events:\t", events.length);
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