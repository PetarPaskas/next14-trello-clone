"use server"

import { db } from "@/lib/db";
import { z } from "zod";

// const CreateBoardSchema = z.object({
//     title: z.string().min(3,{
//         message:"Minimum length of 3 letters is required"
//     })
// })

// export type State = {
//     errors?:{
//         title?:string[]
//     },
//     message?: string | null
// }

// export async function createBoard(prevState:State, formData: FormData):Promise<State>{
//     console.log(prevState);
//     const validatedFields = CreateBoardSchema.safeParse({
//         title: formData.get("title")
//     });

//     if(!validatedFields.success)
//     {
//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//             message: "Missing fields"
//         }
//     }
    
//     const title = formData.get("title") as string;

//     console.log("Creating board - ",title);
//     try{
//         await db.board.create({
//             data:{
//                 title
//             }
//         });
//     }catch(err){
//         return {
//             message:"Database error"
//         };
//     }
//     return ({});

// }


export async function getAllBoards(){
    return await db.board.findMany();
}