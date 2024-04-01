"use client";

import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";
 
interface ActivityProps {
    items:AuditLog[]
}
export const Activity = ({items}:ActivityProps)=>{
    return <div className="flex items-start gap-x-3 w-full">
        <ActivityIcon className="w-5 mt-0.5 h-5 text-neutral-700"/>
        <div className="w-full">
            <div className="font-semibold text-neutral-700 mb-2">
                <ol className="mt-2 space-y-2">
                    {items.map((item)=>{
                        return <ActivityItem key={item.id} data={item}/>
                    })}
                </ol>
            </div>
        </div>
    </div>
}

Activity.Skeleton = ()=>{
    return <div className="flex items-start gap-x-3 w-full">
        <Skeleton className="bg-neutral-200 h-6 w-6"/>
        <div className="w-full ">
            <Skeleton className="bg-neutral-200 h-6 w-24 mb-2"/>
            <Skeleton className="bg-neutral-200 h-10 w-full"/>
        </div>
    </div>
}