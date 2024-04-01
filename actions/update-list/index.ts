"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, OutputType } from "./types";
import { UpdateListSchema } from "./schema";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";



const handler = async (data:InputType):Promise<OutputType>=>{
    const {orgId} = auth();

    if(!orgId)
    {
        return {
            error:"Unathorized"
        }
    }

    const {id, boardId, title} = data;
    let list;
    try{
        list = await db.list.update({
            where:{
                id:id,
                boardId: boardId,
                board:{
                    orgId:orgId
                }
            },
            data:{
                title:title
            }
        });

        createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE
        })
    }catch(error){
        return {
            error:"Failed to update"
        }
    }
    
    revalidatePath(`board/${boardId}`);

    return {
        data:list
    }
}

export const UpdateListAction = createSafeAction(UpdateListSchema, handler);