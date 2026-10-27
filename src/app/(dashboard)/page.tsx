import prisma from "@/lib/prisma";
import { auth } from "../../lib/auth";

const session = await auth();

export default function Home() {
  return (
    <div>
        
    </div>
  )
}