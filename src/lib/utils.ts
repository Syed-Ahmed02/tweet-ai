import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");

// export const copyWritingStyles = ["AIDA", "BAB", "HSO"] as const;

// export const copyWritingStylesPrompts =
// {
//   "AIDA": `AIDA (Attention, Interest, Desire, Action):
//             This formula is used to grab the attention
//             of the reader, create interest in the product
//             or service, build desire for it, and ultimately
//             encourage the reader to take action and
//             make a purchase or inquiry.`,
//   "BAB": `BAB (Before, After, Bridge): This
//             formula is used to show the reader
//             their current situation, the desired
//             outcome, and how the product or
//             service will bridge the gap between the
//             two.`,
//   "HSO":`The Hook, Story, Offer (HSO): This
//           formula is used to grab the reader's
//           attention with a hook, draw them in
//           with a story, and make an offer that
//           relates to the story.`
// }
