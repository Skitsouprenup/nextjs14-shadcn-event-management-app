'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePathname } from 'next/navigation';

import TrashIcon from "../icons/TrashIcon";
import { deleteEvent } from "@/lib/server_actions/event.actions";
import { Button } from "../ui/button";


const DeleteEventConfirmDialog = (
  {eventId, eventTitle, userProfileRedirect}:
  {
    eventId:string,
    eventTitle:string,
    userProfileRedirect?:boolean
  }
) => {
  const pathname = usePathname();

  const topDivStyle = `rounded-xl bg-stone-200 
  ${!userProfileRedirect && 'w-[36px] h-[36px]'}
  flex items-center justify-center border border-gray-300
  ${!userProfileRedirect && 'hover:scale-105 transition-all duration-300'}`;

  return (
    <div className={topDivStyle}
    >
      <AlertDialog>
        <AlertDialogTrigger className="w-fit h-fit flex">
          {
            !userProfileRedirect ? 
            (<TrashIcon color="#EC2D01" />) :
            <div>
              <Button variant="destructive" className="md:w-fit">
                Delete
              </Button>
            </div>
          }
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure do you want to delete {`'${eventTitle}'?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500"
              onClick={async () => {
                try {
                  await deleteEvent({eventId, path: pathname});
                  if(userProfileRedirect)
                    window.location.replace(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile`)
                }
                catch(error) {
                  console.error(error)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteEventConfirmDialog