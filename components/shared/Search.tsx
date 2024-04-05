"use client"

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

const Search = (
  {placeholder='Search...'}:
  {placeholder?:string}
) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
    searchParams.toString() converts the URL
    query stream to string. For example,
    we have this URL:
    http://localhost:3000/?search=test&type=text

    searchParams.toString() grabs the query string
    and convert it to string ('?' is excluded):
    search=test&type=text
  */

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = '';

      if(query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'search',
          value: query
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['search']
        })
      }

      router.replace(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router])

  return (
    <div className="
      flex justify-center min-h-[54px] w-full overflow-hidden 
      rounded-xl bg-stone-100 p-2"
    >
      <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />
      <Input 
        type="text"
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-stone-100 border-0 outline-offset-0 placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}

export default Search