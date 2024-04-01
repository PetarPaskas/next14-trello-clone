"use client";

import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";

import { UpdateCardAction } from "@/actions/update-card";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";

interface HeaderProps{
    data:CardWithList | undefined
}

export const Header = ({
    data
}:HeaderProps)=>{

    if(!data)
    return null;

    const queryClient = useQueryClient();
    const params = useParams();
    const [title, setTitle] = useState(data.title);
    const inputRef = useRef<ElementRef<"input">>(null);

    const {execute} = useAction(UpdateCardAction, {
        onSuccess(successData){
            queryClient.invalidateQueries({
                queryKey:["card", successData.id]
            });

            queryClient.invalidateQueries({
                queryKey:["card-logs", successData.id]
            });

            toast.success("Renamed to "+successData.title);
            setTitle(successData.title);
        },
        onError(error){
            toast.error("Error while updating a card - "+error)
            setTitle(data.title);
        }
    })

    const onBlur = ()=>{
        inputRef.current?.form?.requestSubmit();
    }

    const onSubmit = (formData:FormData)=>{
        const title = formData.get("title") as string;
        const boardId = params.boardId as string;

        if(title === data.title){
            return;
        }

        execute({
            title,
            boardId,
            id:data.id
        });
    }

    return (
        <div className="flex items-start gap-x-3 mb-6 w-full">
            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <div>
                <form action={onSubmit}>
                    <FormInput 
                        className="font-semibold text-xl px-1 text-neutral-700 bg-transparent boarder-transparent relative -left-1.5 w-[95%] focus-visible:background-white focus-visible:border-input mb-0.5 truncate"
                        id="title"
                        ref={inputRef}
                        defaultValue={title}
                        onBlur={onBlur}
                        />
                </form>
                <form className="text-sm text-muted-foreground">
                    in list <span className="underline">{data.list.title}</span>
                </form>
            </div>
        </div>
    )
}

Header.Skeleton = function(){
    return <div className="flex items-start gap-x-3 mb-6">
        <Skeleton 
            className="h-6 w-6 mt-1 bg-neutral-200"
            />
        <div>
            <Skeleton className="w-24 h-6 mb-1 bg-neutral-200"/>
            <Skeleton className="w-12 h-4 bg-neutral-200"/>
        </div>
    </div>
}