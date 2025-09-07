import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="z-20 flex flex-col items-center justify-start min-h-screen py-2 mt-10">
      <div  className="flex flex-col justify-center items-center my-5">
        <Image src={"/hero2.svg"} alt="hero" height={310} width={310}/>

        <h1 className=" z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight leading-[1.3] ">
        CodeX IDE With with Intelligence
      </h1>
      </div>
      <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400 px-5 py-10 max-w-2xl">
        CodeX IDE is a powerful and intelligent code editor that enhances
        your coding experience with advanced features and seamless integration.
        It is designed to help you write, debug, and optimize your code
        efficiently.
      </p>
      <Link href={"/dashboard"}>
        <Button variant={"link"} className="mb-4" size={"lg"}>
          Get Started
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
      
    </div>
  );
}
