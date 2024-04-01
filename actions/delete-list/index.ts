"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { DeleteList } from "./schema";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async ({id, boardId}:InputType):Promise<ReturnType>=>{
    const {userId, orgId} = auth();

    if(!orgId || !userId)
    {
        return {
            error:"Unauthorized"
        }
    }

    let deletedList;
    try{
        deletedList = await db.list.delete({
            where:{
                id,
                boardId,
                board:{
                    orgId,
                }
            }
        });

        await createAuditLog({
            entityId: deletedList.id,
            entityTitle: deletedList.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.DELETE
        })

    }catch(error){
        return {
            error: "Failed to delete"
        };
    }

    revalidatePath(`/board/${boardId}/`);

    return {
        data: deletedList
    }
}

export const DeleteListAction = createSafeAction(DeleteList, handler);