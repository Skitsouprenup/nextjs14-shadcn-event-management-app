import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <footer 
      className="w-full"
      style={{backgroundColor: 'none'}}
    >
      <div className="
        md:justify-between items-center
        flex md:flex-row flex-col p-3 border-t 
        border-gray-400 gap-[0.5rem]"
      >
        <div className="flex items-center">
          <Link href="/">
            <Image
              className="object-contain"
              alt="brand"
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

        <p>Copyright&copy; 2024. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer