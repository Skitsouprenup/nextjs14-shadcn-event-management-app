import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

import Image from "next/image"
import NavItems from "../NavItems"

const MobileNav = () => {

  return (
    <nav className="md:hidden flex justify-between items-center">
      <Sheet>
        <SheetTrigger>
          <Image 
            alt="menu"
            src="/assets/icons/mobile-nav-menu-icon.svg"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent>
          <div className="flex items-center pb-1">
            <Image
              className="object-contain"
              alt="brand"
              src="/assets/survey-papers-icon.png" 
              width={50} 
              height={20}
            />
            <h2 className="font-semibold text-xl">
              Get Event
            </h2>
          </div>
          <Separator className="bg-gray-300 mb-2"/>
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav