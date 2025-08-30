import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" text-secondary">
      <Button>Hello</Button>
      <UserButton/>
    </div>
  );
}
