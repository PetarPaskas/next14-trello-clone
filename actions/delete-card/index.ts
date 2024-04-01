"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { DeleteCard } from "./schema";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data:InputType):Promise<ReturnType>=>{
    const {userId, orgId} = auth();

    if(!orgId || !userId)
    {
        return {
            error:"Unauthorized"
        }
    }

    const {id, boardId} = data;
    let card;
    try{
        card = await db.card.delete({
            where:{
                id,
                list:{
                    board:{
                        orgId
                    }
                }
            }
        });
        
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.DELETE
        })

    }catch(error){
        return {
            error: "Failed to delete"
        };
    }

    revalidatePath(`/board/${boardId}/`);

    return {
        data: card
    }
}

export const DeleteCardAction = createSafeAction(DeleteCard, handler);