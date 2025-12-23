import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function Subnav() {
    const [open, setOpen] = useState(false);

    const handleDroupDown = () => {
        setOpen(menu => !menu);
    }
    return (
        <div className="text-lg cursor-pointer font-sans">
            <button
                onClick={() => handleDroupDown()}
                className="text-lg cursor-pointer font-sans" >
                <FaUserCircle size={24} className="cursor-pointer" />
            </button>
            <div className={`absolute top-full right-0 ${open ? "block" : "hidden"
                } bg-white border border-default-medium rounded-base shadow-lg w-44`}
            >
                <ul
                    className="p-2 text-sm text-body font-sans"
                    aria-labelledby="dropdownMultiLevelButton"
                >
                    <li className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                        My Profile

                    </li>
                    <li className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                        My Orders
                    </li>
                    <li className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                        Logout
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default Subnav