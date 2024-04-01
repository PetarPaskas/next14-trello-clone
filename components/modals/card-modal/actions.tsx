"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { CopyCardAction } from "@/actions/copy-card";
import { DeleteCardAction } from "@/actions/delete-card";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useCardModal } from "@/hooks/use-card-modal";

interface ActionsProps{
    data:CardWithList
}

export const Actions = ({
    data
}:ActionsProps)=>{

    const params = useParams();
    const cardModal = useCardModal();

    const {execute:copyCard, isLoading: isLoadingCopy} = useAction(CopyCardAction,{
        onSuccess(data){
            toast.success(`Card copied successfully: ${data.title}`);
            cardModal.onClose();
        },
        onError(error){
            toast.error("Error while copying a card: "+error);
        }
    });

    const {execute:deleteCard, isLoading: isLoadingDelete} = useAction(DeleteCardAction,{
        onSuccess(data){
            toast.success(`Card deleted successfully: ${data.title}`);
            cardModal.onClose();
        },
        onError(error){
            toast.error("Error while deleting a card: "+error);
        }
    });

    const onCopy = ()=>{
        copyCard({
            id: data.id,
            boardId: params.boardId as string
        })
    }

    const onDelete = ()=>{
        deleteCard({
            id: data.id,
            boardId: params.boardId as string
        })
    }


    return (<div className="space-y-2 mt-2">
        <p className="text-xs font-semibold">
            Actions
        </p>
        <Button
            variant="gray"
            className="w-full justify-start"
            size="inline"
            disabled={isLoadingCopy}
            onClick={onCopy}
            >
            <Copy className="h-4 w-4 mr-2"/>
            Copy
        </Button>
        <Button
            variant="gray"
            className="w-full justify-start"
            size="inline"
            disabled={isLoadingDelete}
            onClick={onDelete}
            >
            <Trash className="h-4 w-4 mr-2"/>
            Delete
        </Button>
    </div>)
}

Actions.Skeleton = ()=>{
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
        </div>
    )
}