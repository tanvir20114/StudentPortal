import React, { useState } from 'react'
import NavBarStudentPortal from './NavBarStudentPortal'
import { Outlet } from 'react-router'
import Nav from './Nav'

export default function StudentPortal() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className='d-flex' style={{ width: '100%', height: "100vh" }}>
      <NavBarStudentPortal isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", height: "100vh" }}>
        <div className="d-flex flex-column" style={{ width: "100%" }}>
          <Nav onToggleSidebar={toggleSidebar} />
          <Outlet />
        </div>
      </div>
    </div>
  )
}