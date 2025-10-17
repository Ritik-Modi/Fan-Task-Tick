import Sidebar from '@/components/common/Sidebar'
// import Navbar from '@/components/common/Navbar'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function DashboardLayout() {
  return (
    <div className='flex flex-col min-h-screen w-full bg-black text-white'>
      <SidebarProvider>
      {/* <Navbar /> */}
        <div className='flex flex-1 w-full'>
          <Sidebar />
          <main className="flex-1 w-full">
            <SidebarTrigger />
            <Outlet /> {/* Child routes render here */}
        </main>
      </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout