
import {z} from "zod";

export const CopyCard = z.object({
    id: z.string({
        required_error:"List id is required"
    }),
    boardId: z.string({
        required_error:"Board id is required"
    })
});