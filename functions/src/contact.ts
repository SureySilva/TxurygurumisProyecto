import {onCall, onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import {defineSecret} from "firebase-functions/params";
import cors from "cors";
import {sanitize} from "./utils/sanitize";

admin.initializeApp();
const corsHandler = cors({origin: true});

export const testFunction = onCall(async () => {
  logger.info("Function llamada");

  return {
    message: "Firebase Functions funcionando correctamente",
  };
});
const GMAIL_USER = defineSecret("GMAIL_USER");
const GMAIL_PASS = defineSecret("GMAIL_PASS");

export const sendContact = onRequest(
  {
    secrets: [GMAIL_USER, GMAIL_PASS],
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const user = GMAIL_USER.value();
        const pass = GMAIL_PASS.value();
        if (req.method !== "POST") {
          res.status(405).send("Método no permitido");
          return;
        }

        const {name, subname, email, message, honeypot} = req.body;
        // Validación
        if (!name || name.length < 2) throw new Error("Nombre inválido");
        if (!email || !email.includes("@")) throw new Error("Email inválido");
        if (!message || message.length < 10) {
          throw new Error("Mensaje inválido");
        }
        // Honeypot anti-bots
        if (honeypot) {
          res.status(400).send({error: "Bot detectado"});
          return;
        }
        // Sanitización de datos
        const cleanData = {
          name: sanitize(name),
          subname: sanitize(subname || ""),
          email: sanitize(email),
          message: sanitize(message),
          createdAt: new Date(),
        };
        // Limitar envíos por email (rate limiting)
        const now = Date.now();
        const limitTime = 10 * 60 * 1000; // 10 minutos

        const lastMessage = await admin
          .firestore()
          .collection("rateLimit")
          .doc(email)
          .get();

        if (lastMessage.exists) {
          const lastTime = lastMessage.data()?.timestamp;

          if (now - lastTime < limitTime) {
            throw new Error("Espera antes de enviar otro mensaje");
          } else {
            await admin.firestore().collection("rateLimit").doc(email).set({
              timestamp: now,
            });
          }
        } else {
          await admin.firestore().collection("rateLimit").doc(email).set({
            timestamp: now,
          });
        }
        // Guardar en Firestore
        await admin.firestore().collection("contacts").add(cleanData);

        // Enviar email
        if (user && pass) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: user,
              pass: pass,
            },
          });

          await transporter.sendMail({
            from: `"Formulario web" <${user}>`,
            to: user,
            replyTo: cleanData.email,
            subject: "Nuevo mensaje de contacto",
            text: `
          Nombre: ${cleanData.name} ${cleanData.subname}
          Email: ${cleanData.email}
          Mensaje:
          ${cleanData.message}
          `,
          });
        }
        res.status(200).send({success: true});
      } catch (error: any) {
        res.status(400).send({error: error.message});
      }
    });
  });
