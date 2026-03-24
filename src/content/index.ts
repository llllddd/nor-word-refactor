// Then entrance to invoke the app builder
import "../styles/main.css";
import { createAppController } from "../app/createAppController";

async function bootstrap() {
  try {
    console.log("[Rebuild] content script loaded");
    const app = createAppController();
    await app.init();
  } catch (error) {
    console.error("bootstrap error:", error);
    if (error instanceof Error) {
      console.error("bootstrap error stack:\n" + error.stack);
    }

    // In debug builds, rethrow so debugger stops at the real origin line.
    if (import.meta.env.MODE === "debug") {
      throw error;
    }
  }
}

bootstrap();
