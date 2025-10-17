import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-black text-white">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  )
}

export default Layout