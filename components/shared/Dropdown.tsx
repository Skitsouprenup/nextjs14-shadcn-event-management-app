import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoryDocument, EventFormData } from "@/types"
import { useState } from "react";
import AddCategoryDialog from "../dialogs/AddCategoryDialog";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type categoryFormData = UseFormReturn<EventFormData, any, undefined>;

const Dropdown = (
  { form, categoryList, isAdmin }:
  { 
    form: categoryFormData, 
    categoryList: Array<CategoryDocument>,
    isAdmin: boolean
  }
) => {
  const [categories, setCategories] = 
    useState<CategoryDocument[]>(categoryList);

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Category</FormLabel>
          <FormControl>
            <div className="form-input-container">
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                {/* 
                  Apply the focus-visible style directly here because it doesn't
                  work when it's applied in globals.css 
                */}
                <SelectTrigger 
                  className="form-input focus-visible:ring-transparent 
                  focus-visible:ring-offset-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {
                    categories.length > 0 && 
                    categories.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))
                  }
                  {
                    isAdmin && <AddCategoryDialog setCategories={setCategories} />
                  }
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage /> 
        </FormItem>
      )}
    />
  )
}

export default Dropdown