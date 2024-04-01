"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async ({boardId, listId, title}: InputType):Promise<ReturnType>=> {
    const {userId, orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Unauthorized"
        }
    }

    let card;

    try{
        const list = await db.list.findUnique({
            where:{
                id:listId,
                board:{
                    orgId
                }
            }
        })

        if(!list)
        return {error:"List not found"}
        
        const lastCard = await db.card.findFirst({where:{listId}, orderBy:{order:"desc"}, select:{order:true}});

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data:{
                title,
                order:newOrder,
                listId
            },
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            action: ACTION.CREATE,
            entityType: ENTITY_TYPE.CARD
        })

    }catch(error){
        return {
            error:"Failed to create."
        }
    }
    
    revalidatePath(`/board/${boardId}`);

    return {
        data: card
    };
}

export const CreateCardAction = createSafeAction(CreateCard, handler);