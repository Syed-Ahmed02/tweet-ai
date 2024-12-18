import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});


//TODO FOR NEXT TIME
/*
Working on rag
https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon
https://github.com/vercel/ai-sdk-rag-starter/blob/main/drizzle.config.ts
https://sdk.vercel.ai/docs/guides/rag-chatbot

*/