"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { UpdateListOrder } from "./schema";
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

    const {boardId, items} = data;
    let lists;

    try{

        const transaction = items.map(list=>{
            return db.list.update({
                where:{
                    id:list.id,
                    board:{
                        orgId
                    }
                },
                data:{
                    order:list.order
                }
            })
        });
        
        lists = await db.$transaction(transaction);

        // const logs = lists.map(x=>createAuditLog({
        //     entityId: x.id,
        //     entityTitle: x.title,
        //     entityType: ENTITY_TYPE.LIST,
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
        data:lists
    }
}

export const UpdateListOrderAction = createSafeAction(UpdateListOrder, handler);