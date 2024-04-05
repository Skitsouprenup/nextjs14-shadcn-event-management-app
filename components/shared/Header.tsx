import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./small_screen/MobileNav"

const Header = () => {
  return (
    <header 
      className="w-full flex gap-[0.75rem] p-1" 
      style={{backgroundColor: 'none'}}
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            className="object-contain"
            alt="brand"
            //This relative path will automatically look
            //for public directory where assets directory
            //is nested
            src="/assets/survey-papers-icon.png" 
            width={70} 
            height={50}
            style={{width: '70px', height: '50px'}}
          />
        </Link>
        <h2 className="font-semibold text-xl">
          Get Event
        </h2>
      </div>

      <div className="flex-1 flex justify-end items-center">
        <SignedIn>
          <div className="flex gap-[10px] items-center">
            <div className="flex-1 hidden md:flex">
              <NavItems />
            </div>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </div>
        </SignedIn>
        <SignedOut>
          <Button asChild size="lg">
            <Link href='/login'>
              Login
            </Link>
          </Button>
        </SignedOut>
      </div>
    </header>
  )
}

export default Header