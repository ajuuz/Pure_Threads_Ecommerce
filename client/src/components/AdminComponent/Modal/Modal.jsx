import React from 'react'
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
  } from "@/components/ui/alert-dialog"
  
  import { Switch } from "@/components/ui/switch";
const Modal = ({id,type,handleClick,state,dialogTitle,dialogDescription,alertDialogTriggerrer}) => {


  return (
    <div>
         {/* Alert Dialog Modal */}
      <AlertDialog>
        <AlertDialogTrigger>
        {type==="switch"?<Switch checked={state} />:alertDialogTriggerrer}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="relative top-5">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>handleClick(id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Modal
