import {useState} from "react"
import { HiOutlineBars2 } from "react-icons/hi2";
function Navigation() {
  const [open, isOpen] = useState(false);

  return (
    <div>
      <div >

        <div className="hidden lg:flex items-center gap-4  my-4 font-bold text-white/90">
          <HiOutlineBars2 />
          <a
            href="/"
            className="relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
          >
            HOME
          </a>
          <a
            href="/"
            className="ml-auto relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
          >
            ABOU
          </a>
          <a
            href="/"
            className="relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
          >
            CONTACT
          </a>
          <a
            href="/"
            className="relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
          >
            CART
          </a>
        </div>
      </div>


      {/* On mobile view */}

    </div>





  );

  
}

export default Navigation;
