"use client";

import { UpdateCardAction } from "@/actions/update-card";
import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionModalProps{
    data:CardWithList
}

export const Description = ({
    data
}:DescriptionModalProps)=>{
    const queryClient = useQueryClient();
    const params = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const textAreaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const enableEditing = ()=>{
        setIsEditing(true);
        setTimeout(()=>{
            textAreaRef.current?.focus();
        })
    }

    const disableEditing = ()=>{
        setIsEditing(false);
    }

    const {execute, fieldErrors} = useAction(UpdateCardAction,{
        onSuccess(data){
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })

            queryClient.invalidateQueries({
                queryKey:["card-logs", data.id]
            });

            toast.success(`Card ${data.title} updated`);
            disableEditing();
        },
        onError(error){
            toast.error(error);
        }
    })



    useEventListener("keydown", (e)=>{
        if(e.key === "Escape"){
            disableEditing()
        }
    })
    useOnClickOutside(formRef, disableEditing)

    const onSubmit = (formData:FormData)=>{
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;

        execute({
            title:data.title,
            id: data.id,
            description,
            boardId
        })
    }
    
    return <div className="flex items-start gap-x-3 w-full">
        <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700"/>
        <div className="w-full">
            <p className="font-semibold text-neutral-700 mb-2">
                Description
            </p>
            {
                isEditing 
                ? (<form 
                    action={onSubmit}
                    className="space-y-2"
                    ref={formRef}>
                        <FormTextarea 
                            ref={textAreaRef}
                            errors={fieldErrors}
                            defaultValue={data.description || undefined}
                            className="w-full mt-2"
                            placeholder="Add a more detailed description.."
                            id="description"/>
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>
                                Save
                            </FormSubmit>
                            <Button 
                                type="button"
                                onClick={disableEditing}
                                size="sm"
                                variant="ghost"
                                >
                                Cancel
                            </Button>
                        </div>
                </form>)
                : (<div onClick={enableEditing}
                        role="button"
                        className="text-sm py-3 px-3.5 rounded-md font-medium min-h-[78px] bg-neutral-200">
                    {data.description || "Add a more detailed description..."}
                    </div>)
            }
        </div>
    </div>
}

Description.Skeleton = ()=>{
    return <div className="flex items-start gap-x-3 w-full">
        <Skeleton className="h-6 w-6 bg-neutral-200"/>
        <div className="w-full">
            <Skeleton className="h-6 w-24 mb-2 bg-neutral-200"/>
            <Skeleton className="h-[78px] w-full mb-2 bg-neutral-200"/>
        </div>
    </div>
}