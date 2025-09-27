# ChronoK

ChronoK is a simple yet powerful time-tracking tool. It provides a web API to start, stop, and toggle time-tracking for different tasks, and a script to analyze the tracked time.

## Usage

To start the web server, run the following command:

```bash
bun start
```

The server will start on port `56843`.

### API Endpoints

`name` can be provided in any of the following ways:

- query arg (query parameter, e.g., `/?name=code-time`)
- script (first argument passed to the script)
- env (CHRONOK_NAME environment variable)
- default ("ChronoK")

The following endpoints are available:

*   `GET /`: Get all events for a given name.
*   `GET /start?name=$name`: Start a new event.
*   `GET /stop?name=$name`: Stop the last event.
*   `GET /toggle?name=$name&notify=true`: Toggle the timer. A desktop notification will be sent if `notify-send` is available.
*   `GET /clear?name=$name`: Clear all events for a name.

### Running the Analysis

To analyze the tracked time for a specific task, run:

```bash
bun analyze [name]
```

If `[name]` is not provided, it will use the `CHRONOK_NAME` environment variable or "ChronoK".

The analysis will output:
*   Total number of events
*   Total time tracked
*   Average event time
*   Gaps between events
*   Average gap time

### Pro-tip

For maximum efficiency, you can bind the `/toggle` endpoint to a keyboard shortcut in your Desktop Environment. For example, you could use `curl` to make the request:

```bash
curl http://localhost:56843/toggle
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
