import { z } from "zod";

export const directionValidator = z.union([z.literal("up"), z.literal("down")]);
