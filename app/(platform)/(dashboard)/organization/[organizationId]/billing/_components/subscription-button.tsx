"use client";

import { StripeRedirectAction } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "sonner";

interface SubscriptionButtonProps{
    isPro:boolean
}
export const SubscriptionButton = ({isPro}:SubscriptionButtonProps)=>{
    const {execute, isLoading} = useAction(StripeRedirectAction, {
        onSuccess(data){
            window.location.href=data;
        },
        onError(error){
            toast.error(error);
        }
    })

    const proModal = useProModal();

    const handleClick = ()=>{
        if(isPro){
            execute({});
        }
        else{
            proModal.onOpen();
        }
    }

    return <Button onClick={handleClick} disabled={isLoading} variant="ghost" >
        {isPro ? "Manage subscription":"Upgrade to pro"}
    </Button>
}