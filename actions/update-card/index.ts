"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data:InputType):Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return { error: "Unauthorized" };
    }

    const {boardId, id, ...values} = data;
    let card; 

    try{
        card = await db.card.update({
            where:{
                id:id,
                list:{
                    board:{
                        orgId
                    }
                }
            }, 
            data:{
                ...values
            }
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE
        })
    }catch{
        return {
            error:"Failed to update"
        }
    }

    revalidatePath(`/boards/${boardId}`);
    return {data:card};
}

export const UpdateCardAction = createSafeAction(UpdateCard,handler);