import { z} from "zod";

export const UpdateListSchema = z.object({
    id: z.string(),
    boardId: z.string(),
    title: z.string({
        invalid_type_error:"Title is required",
        required_error:"Title is required"
    }).min(3)
})