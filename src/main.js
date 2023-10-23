import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

// web.listen(3002, () => {
//   logger.info("App start");
// });

const port = process.env.PORT || 3002;
web.listen(3002, () => {
  logger.info(`Server listening on port ${port}`);
});

// const port = process.env.PORT;
// app.listen(port, () => console.log(`Server listening on port ${port}`));
