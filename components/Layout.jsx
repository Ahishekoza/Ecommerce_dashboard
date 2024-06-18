import Navigation from "@/components/Navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        <div className=" bg-blue-900 w-screen h-screen flex items-center justify-center">
          <button
            onClick={() => signIn()}
            className="bg-white px-4 py-2 rounded-md font-medium "
          >
            Login with Google
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className=" bg-blue-900  h-screen flex">
        <Navigation />
        <div className="bg-white flex-grow  mr-2  p-4">{children}</div>
      </div>
    </>
  );
}
