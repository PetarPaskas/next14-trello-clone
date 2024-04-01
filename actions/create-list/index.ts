"use server";

import { createSafeAction } from "@/lib/create-safe-action"
import {InputType, ReturnType} from "./types";
import { CreateList } from "./schema";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";


const handler = async (data:InputType):Promise<ReturnType> =>{
    const {orgId} = auth();

    if(!orgId)
    {
        return{
            error:"Unauthorized"
        };
    }

    const {title, boardId} = data;
    let list;

    try{
        const board = await db.board.findUnique({
            where:{
                id:boardId,
                orgId
            }
        });

        if(!board){
            return { error:"Board not found." };
        }

        const lastListPosition = await db.list.findFirst({
            where:{
                boardId: boardId
            },
            orderBy:{
                order:"desc"
            },
            select: {order:true}
        });

        const newOrder = lastListPosition ? lastListPosition.order + 1 : 1;
        
        list = await db.list.create({
            data:{
                title,
                boardId, 
                order: newOrder
            }
        })

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE
        })
    }catch(error){
        return {
            error: "Failed to create."
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data:list};
}

export const CreateListAction = createSafeAction(CreateList, handler)