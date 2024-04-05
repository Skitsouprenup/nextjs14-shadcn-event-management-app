'use client';

import { headerLinks } from "@/utils/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItems = () => {
  const pathname = usePathname();

  return (
    <ul className="flex md:flex-row
      flex-1 gap-[1rem] flex-col
      md:justify-center items-start"
    >
      {
        headerLinks.map((item) => {
          const isActive = pathname === item.route

          return (
            <li key={item.id}>
              <Link
                className={`text-lg ${isActive ? 'text-amber-700' : ''}`}
                href={item.route}
              >
                <p>{item.label}</p>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}

export default NavItems