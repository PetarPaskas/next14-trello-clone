
import {z} from "zod";
import { UpdateListSchema } from "./schema";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateListSchema>;

export type OutputType = ActionState<InputType, List>;