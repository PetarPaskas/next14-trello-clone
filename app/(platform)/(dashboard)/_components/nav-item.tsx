"use client"

import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
 
export type Organization = {
    id:string;
    slug:string;
    imageUrl:string;
    name:string;
}
interface NavItemProps {
    isActive:boolean,
    isExpand:boolean,
    onExpand:(id:string)=>void,
    organization:Organization
}

export function NavItem({isActive,isExpand,onExpand,organization}:NavItemProps){
    const router = useRouter();
    const pathName = usePathname();

    const routes = [
        {label:"Boards",
        icon:<Layout className="h-4 w-4 mr-2"/>,
        href:`/organization/${organization.id}`},
        {label:"Activity",
        icon:<Activity className="h-4 w-4 mr-2"/>,
        href:`/organization/${organization.id}/activity`},
        {label:"Settings",
        icon:<Settings className="h-4 w-4 mr-2"/>,
        href:`/organization/${organization.id}/settings`},
        {label:"Billing",
        icon:<CreditCard className="h-4 w-4 mr-2"/>,
        href:`/organization/${organization.id}/billing`}
    ]

    const handleClick = (href:string)=>{
        router.push(href);
    }
    
    return <AccordionItem
        value={organization.id}
        className="border-none">
            <AccordionTrigger
                onClick={()=>onExpand(organization.id)}
                className={cn(
                    "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
                    isActive && !isExpand && "bg-sky-500/10 text-sky-700"
                  )}
                >
                    <div className="flex items-center gap-x-2">
                        <div className="w-7 h-7 relative">
                            <Image fill src={organization.imageUrl} className="rounded-sm bg-cover" alt="Organization"/>
                        </div>
                        <span  className="font-medium text-small">
                            {organization.name}
                        </span>
                    </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
                    {routes.map((route)=>{
                        return <Button 
                        key={route.href} 
                        size="sm" 
                        onClick={()=>handleClick(route.href)}
                        className={cn("w-full font-normal- justify-start pl-10 mb-1",
                        pathName === route.href && "bg-sky-500/10 text-sky-700")}
                        variant="ghost"
                        >
                            {route.icon}
                            {route.label}
                        </Button>
                    })}
            </AccordionContent>
        </AccordionItem>
}

NavItem.Skeleton = function(){
    return (<div className="flex items-center gap-x-2">
        <div className="w-10 h-10 relative shrink-0">
            <Skeleton className="h-full w-full absolute"/>
        </div>
        <Skeleton className="h-10 w-full"/>
    </div>)
}