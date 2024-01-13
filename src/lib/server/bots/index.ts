import TelegramBot, { Message } from "node-telegram-bot-api";
import { telegramClient } from "@/lib/server/telegram";
import { handleEmailForwardingMessage } from "@/lib/server/bots/mail-forwarding";

export function getCommand(msg: Message): string | undefined {
  if (msg.text && msg.text.startsWith("/")) {
    return msg.text.substring(1).trim();
  }
  return undefined;
}

export type MessageHandler = (opts: {
  msg: Message;
  client: TelegramBot;
  isNewUser: boolean;
  botToken: string;
  appHost: string;
  botHandle: string;
}) => Promise<void>;
export type TelegramBotHandler = {
  handleMessage: MessageHandler;
};

export const allBots: Record<string, TelegramBotHandler> = {
  phone1_929_264_5065_bot: {
    handleMessage: async ({ msg, client, isNewUser }) => {
      if (isNewUser) {
        await client.sendMessage(msg.chat.id, "Welcome! This bot will be sending you forwarded SMS messages", {
          parse_mode: "HTML",
        });
      } else {
        await client.sendMessage(
          msg.chat.id,
          "I'm not a real bot, I can't understand your messages. I'm here just to forward SMS messages to you",
          { parse_mode: "HTML" }
        );
      }
    },
  },
  MailForwardingBot: {
    handleMessage: handleEmailForwardingMessage,
  },
  DebuggerForYourBot: {
    handleMessage: async ({ msg, client }) => {
      if (!msg.chat.id) {
        console.log("No chat id in msg", msg);
      }
      await client.sendMessage(msg.chat.id, `<pre>${JSON.stringify(msg, null, 2)}</pre>`, {
        parse_mode: "HTML",
      });
    },
  },
};
