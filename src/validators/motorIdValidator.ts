import { z } from "zod";

export const motorIdValidator = z.union([z.literal(0), z.literal(1)]);
