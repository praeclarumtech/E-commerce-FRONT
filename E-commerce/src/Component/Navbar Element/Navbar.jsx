import { useState } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import Subnav from "./SubNav";

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    return (

        <nav className="relative w-full border-b border-gray-200 bg-white font-sans">
            <div className="flex items-center justify-between px-4 py-4 md:px-10 md:py-5">

                <div className="text-xl md:text-2xl font-bold tracking-wide">
                    Logo
                </div>

                <ul className="hidden md:flex space-x-10 text-base">
                    <li className="hover:underline underline-offset-4 cursor-pointer">Home</li>
                    <li className="hover:underline underline-offset-4 cursor-pointer">Contact</li>
                    <li className="hover:underline underline-offset-4 cursor-pointer">About</li>
                    <li className="hover:underline underline-offset-4 cursor-pointer">Sign Up</li>
                </ul>

                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="flex relative items-center bg-gray-100 rounded px-3 py-2">
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            className="bg-transparent text-sm outline-none w-32 lg:w-48 placeholder-gray-500"
                        />
                        <FaSearch size={24} className="ml-2 cursor-pointer text-black" />
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-4">
                        <FaHeart size={24} className="cursor-pointer" />
                        <FaShoppingCart size={24} className="cursor-pointer" />

                        <Subnav />

                        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <FaX size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 z-50 md:hidden">
                    <ul className="flex flex-col p-4 space-y-4 text-center font-medium">
                        <li>Home</li>
                        <li>Contact</li>
                        <li>About</li>
                        <li>Sign Up</li>
                    </ul>
                </div>
            )}
        </nav>
    )
}
export default Navbar