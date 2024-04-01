"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useState, useEffect } from "react";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { UpdateListOrderAction } from "@/actions/update-list-order";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd"
import { toast } from "sonner";
import { UpdateCardOrderAction } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[],
    boardId: string
}

export function ListContainer({data, boardId}:ListContainerProps){
    const [orderedData, setOrderedData] = useState(data);

    const {execute:executeUpdateListOrder} = useAction(UpdateListOrderAction,{
        onSuccess(data){
            toast.success("List reordered");
        },
        onError(error){
            toast.error(error);
            setOrderedData(orderedData);
        }
    })

    const {execute:executeUpdateCardOrder} = useAction(UpdateCardOrderAction,{
        onSuccess(data){
            toast.success("Cards reordered");
        },
        onError(error){
            toast.error(error);
            setOrderedData(orderedData);
        }
    })

    function reorder<T>(list:T[], startIndex:number, endIndex:number){
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return result;
    }

    const onDragEnd = (result:any)=>{
        const {destination, source, type} = result;
        if(!destination){
            return;
        }
        //if dropped in the same position
        if(destination.droppableId === source.droppableId &&
            destination.index === source.index){
                return;
            }
        
        //If user is moving a list
        if(type === "list"){
            let prevState;

            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index)=>({...item, order:index}));
                
            setOrderedData(prev=>{
                prevState = prev;
                return items;
            });

            //TODO: Trigger server action;
            executeUpdateListOrder({items, boardId});
        }

        //User moves a card
        if(type === "card"){
            let newOrderedData = [...orderedData];

            //Source and destination list 
            const sourceList = newOrderedData.find(list=> list.id === source.droppableId);
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId);
            
            if(!sourceList || !destinationList){
                return;
            }

            //Check if cards exist in lists 
            if(!sourceList.cards){
                sourceList.cards = []
            }

            if(!destinationList.cards){
                destinationList.cards = [];
            }

            //Moving the card in the same list 
            if(source.droppableId === destination.droppableId){
                const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

                reorderedCards.forEach((card, index)=>{
                    card.order = index;
                })

                sourceList.cards = reorderedCards;

                let oldState;
                setOrderedData((prev)=>{
                    oldState = prev;
                    return newOrderedData;
                })

                //TODO: Trigger server action
                executeUpdateCardOrder({items: reorderedCards, boardId})

            }else{
                //User moves the card to another list
                const [movedCard] = sourceList.cards.splice(source.index, 1);
                
                //Assign the new listId to the moved card
                movedCard.listId = destination.droppableId;
                
                //Add card to the destination
                destinationList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, index)=>{
                    card.order = index;
                })
                destinationList.cards.forEach((card,index)=>{
                    card.order = index;
                });

                let oldState;
                setOrderedData((prev)=>{
                    oldState = prev;
                    return newOrderedData
                });

                //TODO server action.
                executeUpdateCardOrder({items: destinationList.cards, boardId})

            }


        }

    }

    useEffect(()=>{
        setOrderedData(data)
    },[data]);

    return (
        <DragDropContext
            onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="lists"
                    type="list"
                    direction="horizontal">
                        {(provided)=>{
                            return (
                                <ol 
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex gap-x-3 h-full">
                                <ListForm/>
                                {provided.placeholder}
                                {orderedData.map((list, index)=>{
                                    return (
                                        <ListItem 
                                            key={list.id} 
                                            index={index}
                                            data={list} />
                                    )
                                })}
                                <div className="flex-shrink-0 w-1"></div>
                            </ol>
                            )
                        }}
                </Droppable>
        </DragDropContext>
        
    )
}