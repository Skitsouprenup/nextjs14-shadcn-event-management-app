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
import { Input } from "../ui/input";
import React, { startTransition, useState } from "react";
import { createCategory } from "@/lib/server_actions/category.actions";
import { CategoryDocument } from "@/types";

const AddCategoryDialog = (
  { setCategories } :
  { setCategories: React.Dispatch<React.SetStateAction<CategoryDocument[]>>}
) => {
  const [entry, setEntry] = useState<string>('');

  const addCategory = () => {
    createCategory({ name: entry.trim() })
    .then((data) => {
      console.log(data)
      setCategories((prevState) => [...prevState, data])
    })
  }

  return (
    <div className="hover:bg-sky-200">
      <AlertDialog>
        <AlertDialogTrigger className="w-full flex">
          Add Category...
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Category</AlertDialogTitle>
            <AlertDialogDescription>
              <Input 
                type="text" 
                placeholder="Category Name"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => startTransition(addCategory)}
            >
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AddCategoryDialog