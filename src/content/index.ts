import "../styles/main.css";
import { createAppController } from "../app/createAppController";

async function bootstrap() {
  try {
    console.log("[Rebuild] content script loaded");
    const app = createAppController();
    await app.init();
  } catch (error) {
    console.error("bootstrap error:", error);
  }
}

bootstrap();
