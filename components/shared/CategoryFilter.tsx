"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategories } from "@/lib/server_actions/category.actions";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { CategoryData } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryFilter = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getCategoryList = async () => {
      const categoryList = await getCategories();

      categoryList && setCategories(categoryList as CategoryData[])
    }

    getCategoryList();
  }, [])

  const onSelectCategory = (category: string) => {
      let newUrl = '';

      if(category && category !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'category',
          value: category
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['category']
        })
      }

      router.push(newUrl, { scroll: false });
  }

  return (
    <div className="bg-stone-100 p-2 rounded-xl flex items-center">
      <span className="relative bottom-[1px] left-[5px] text-lg">
      Category:
      </span>
      <Select defaultValue="All" onValueChange={(value: string) => onSelectCategory(value)}>
        <SelectTrigger
          className="bg-stone-100 border-0 focus-visible:ring-transparent 
          focus-visible:ring-offset-0 text-lg"
        >
          <SelectValue placeholder="Category..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>

          {categories.map((category) => (
            <SelectItem value={category.name} key={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    
  )
}

export default CategoryFilter