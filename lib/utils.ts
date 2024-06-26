import { type ClassValue, clsx } from "clsx"
import qs from "qs"
import { twMerge } from "tailwind-merge"

//Automatically generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const handleError = (error: unknown) => {
  console.error(typeof error === 'string' ? error : JSON.stringify(error));
}

export const formatDateTime = (dateString: string) => {
  const ms = Date.parse(dateString);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  const formattedDateTime: string = new Date(ms).toLocaleString('en-US', dateTimeOptions)

  const formattedDate: string = new Date(ms).toLocaleString('en-US', dateOptions)

  const formattedTime: string = new Date(ms).toLocaleString('en-US', timeOptions)

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export const clampLetters = (text:string, maxLetters:number) => {
  let newText = text;

  if(text.length > maxLetters) {
    newText = text.substring(0, maxLetters).trim() + '...';
  }

  return newText;
}

export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

  return formattedPrice
}

export function formUrlQuery(
  { params, key, value }:
  {
    params: string
    key: string
    value: string
  }
) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  let url = qs.stringify(
    currentUrl,
    { skipNulls: true }
  );
  
  url = process.env.NEXT_PUBLIC_SERVER_URL + window.location.pathname + '?' + url;

  return url;
}

export function removeKeysFromQuery(
  { params, keysToRemove }: 
  {
    params: string
    keysToRemove: string[]
  }
) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  //const nullsSkipped = qs.stringify({ a: 'b', c: null }, { skipNulls: false });
  //console.log(nullsSkipped)
  const url = qs.stringify(
    currentUrl,
    { skipNulls: true }
  )

  let urlString = process.env.NEXT_PUBLIC_SERVER_URL + window.location.pathname + '?' + url; 

  if(url) return urlString;
  return process.env.NEXT_PUBLIC_SERVER_URL + window.location.pathname;
}
