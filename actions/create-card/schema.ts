import {z} from "zod";

export const CreateCard = z.object({
    boardId:z.string(),
    listId:z.string({
        required_error:"List id required",
        invalid_type_error:"List id required"
    }),
    title:z.string({
        required_error:"Title is required",
        invalid_type_error:"Title is required"
    }).min(3),
});