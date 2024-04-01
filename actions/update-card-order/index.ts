"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { UpdateCardOrder } from "./schema";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";



const handler = async (data:InputType):Promise<ReturnType>=>{
    const {orgId, userId} = auth();

    if(!orgId || !userId)
    {
        return {
            error:"Unathorized"
        }
    }

    const {items, boardId} = data;
    let cards;

    try{
        const transaction = items.map(card=>{
            return db.card.update({
                where:{
                    id:card.id,
                    list:{
                        board:{
                            orgId
                        }
                    }
                },
                data:{
                    order:card.order,
                    listId: card.listId
                }
            });
        });

        cards = await db.$transaction(transaction);

        // const logs = cards.map(x=>createAuditLog({
        //     entityId: x.id,
        //     entityTitle: x.title,
        //     entityType: ENTITY_TYPE.CARD,
        //     action: ACTION.UPDATE
        // }));

        // Promise.all(logs);

    }catch(error){
        return {
            error:"Failed to reorder"
        }
    }
    
    revalidatePath(`board/${boardId}`);

    return {
        data:cards
    }
}

export const UpdateCardOrderAction = createSafeAction(UpdateCardOrder, handler);