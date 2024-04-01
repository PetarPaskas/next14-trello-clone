"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CopyList } from "./schema";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async ({id, boardId}:InputType):Promise<ReturnType>=>{
    const {userId, orgId} = auth();

    if(!orgId || !userId)
    {
        return {
            error:"Unauthorized"
        }
    }

    let list;
    try{
        const listCopy = await db.list.findUnique({
            where:{
                id,
                boardId,
                board:{
                    orgId,
                }
            },
            include:{
                cards:true
            }
        });

        if(!listCopy){
            return {
                error:"List not found"
            }
        }

        const lastList = await db.list.findFirst({
            where:{boardId},
            orderBy:{order:"desc"},
            select:{order:true}
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data:{
                title:listCopy.title + " - copy",
                boardId:listCopy.boardId,
                order:newOrder,
                cards:{
                    createMany:{
                        data: listCopy.cards.map(x=>({
                            title: x.title,
                            description: x.description,
                            order: x.order
                        }))
                    }
                }
            },
            include:{cards:true}
        });

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE
        })

    }catch(error){
        return {
            error: "Failed to copy"
        };
    }

    revalidatePath(`/board/${boardId}/`);

    return {
        data: list
    }
}

export const CopyListAction = createSafeAction(CopyList, handler);