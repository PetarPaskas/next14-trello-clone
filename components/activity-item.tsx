import { generateLogMessage } from "@/lib/generate-log-message"
import { AuditLog } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar";
import {format} from "date-fns";

interface ActivityItemProps{
    data: AuditLog
}
export const ActivityItem = ({data}:ActivityItemProps)=>{
    let message = "";
    if(data){
        message = generateLogMessage(data);
    }

    return <>
        <li className="flex items-center gap-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.userImage}/>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold lowercase text-neutral-700">
                        {data.userName}
                    </span>
                    {message}
                </p>
                <p className="text-xs text-muted-foreground">
                {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
        </li>
    </>
}