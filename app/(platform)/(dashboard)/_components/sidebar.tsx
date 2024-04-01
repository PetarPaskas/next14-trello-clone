"use client"

import Link from "next/link";
import {Plus} from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Accordion} from "@/components/ui/accordion";
import { NavItem, Organization } from "./nav-item";
interface SidebarProps {
    storageKey?:string
}
export default function Sidebar({
    storageKey
}:SidebarProps){
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey ?? "t-sidebar-state", {});
    const {
        organization:activeOrganization,
        isLoaded:isLoadedOrganization} = useOrganization();
    
    const {userMemberships, isLoaded:isLoadedOrganizationList} = useOrganizationList({
        userMemberships:{
            infinite:true
        }
    }); //taj obj parametar je za pagination

    const defaultAccordionValue:string[] = Object.keys(expanded)
        .reduce((accumulator:string[], key:string)=>{
            if(expanded[key])
            accumulator.push(key)

            return accumulator;
        },[]);

    const handleExpand = (id:string)=>{
        setExpanded((prev)=>({...prev,[id]:!prev[id]}));
    }

    if(!isLoadedOrganization || !isLoadedOrganizationList || userMemberships.isLoading){
        return <>
          <div className="items-center flex justify-between mb-2">
            <Skeleton className="w-[50%] h-10"/>
            <Skeleton className="w-10 h-10"/>
          </div>
          <div className="space-y-2">
            <NavItem.Skeleton/>
            <NavItem.Skeleton/>
            <NavItem.Skeleton/>
          </div>  
        </>
    }

    return  (
        <>
          <div className="font-medium text-xs flex items-center mb-1">
            <span className="pl-4">
              Workspaces
            </span>
            <Button
              asChild
              type="button"
              size="icon"
              variant="ghost"
              className="ml-auto"
            >
              <Link href="/select-org">
                <Plus
                  className="h-4 w-4"
                />
              </Link>
            </Button>
          </div>
          <Accordion
            type="multiple"
            defaultValue={defaultAccordionValue}
            className="space-y-2"
          >
            {userMemberships.data.map(({ organization }) => (
              <NavItem
                key={organization.id}
                isActive={activeOrganization?.id === organization.id}
                isExpand={expanded[organization.id]}
                organization={organization as Organization}
                onExpand={handleExpand}
              />
            ))}
          </Accordion>
        </>
      );
}