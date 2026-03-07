import {onCall} from "firebase-functions/v2/https";
import {logger} from "firebase-functions";

export const testFunction = onCall(async () => {
  logger.info("Function llamada");

  return {
    message: "Firebase Functions funcionando correctamente",
  };
});
