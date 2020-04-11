import {
    green,
    cyan,
    bold,
    yellow,
    red
} from "fmt";

import { Application, HttpError, send, Status } from "oak";

const app = new Application();

// Error handler middleware
app.use(async (context, next) => {
    console.log(`${Deno.cwd()}/dist`);
    try {
        await next();
    } catch (e) {
        if (e instanceof HttpError) {
            context.response.status = e.status as any;
            if (e.expose) {
                context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${e.message}</h1>
              </body>
            </html>`;
            } else {
                context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${Status[e.status]}</h1>
              </body>
            </html>`;
            }
        } else if (e instanceof Error) {
            context.response.status = 500;
            context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>500 - Internal Server Error</h1>
              </body>
            </html>`;
            console.log("Unhandled Error:", red(bold(e.message)));
            console.log(e.stack);
        }
    }
});

// Logger
app.use(async (context, next) => {
    await next();
    const rt = context.response.headers.get("X-Response-Time");
    console.log(
        `${green(context.request.method)} ${cyan(context.request.url)} - ${bold(
            String(rt),
        )}`,
    );
});

// Response Time
app.use(async (context, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    context.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Send static content
app.use(async (context) => {
    // console.log(context.request.path);
    await send(context, context.request.path, {
        root: `${Deno.cwd()}/dist`,
        index: "index.html",
    });
});

const address = "127.0.0.1:8000";
console.log(bold("Start listening on ") + yellow('http://' + address));
await app.listen(address);
