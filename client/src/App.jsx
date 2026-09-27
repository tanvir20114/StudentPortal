import React from 'react'
import './App.css'
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from 'react-router';

export default function App() {
  const navigate = useNavigate();
  function navigator(){
    navigate('/SignIn');
  }
  function navigator2(){
    navigate('/Ragister');
  }

  return (
    <div className='d-flex flex-column justify-content-between UI min-vh-100 position-relative mb-0'>
      <nav className='border w-100 py-3 d-flex flex-wrap gap-3 px-3 px-md-5 justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-2'>
          <h1 className='m-0 fs-3'><FaUniversity /></h1>
          <h3 className='d-flex flex-column justify-content-center m-0 p-0 fs-5 fs-md-3'>XYZ UNIVERSITY</h3>
        </div>
        <div className="d-flex gap-4">
          <h6 className='m-0'>Home</h6>
        </div>
      </nav>

      <main className='flex-grow-1 w-100 border d-flex justify-content-center align-items-center px-3 py-4'>
        <div className='gap-4 gap-md-5 d-flex flex-column p-3 p-md-5 text-center w-100' style={{maxWidth:"500px"}}>
          <h1 className='fs-2 fs-md-1'>XYZ UNIVERSITY</h1>
          <div className="border p-4 p-md-4 mb-3 d-flex flex-column gap-2 gap-md-2 rounded">
            <h2 className='fs-4 fs-md-2'>Welcome to Student Portal</h2>
            <button
              onClick={()=>navigator()}
              className="rounded-pill text-center text-white p-0 m-0 py-3"
              style={{backgroundColor:"#373063"}}
            >
              <h6 className='p-0 m-0' style={{transform:"scaleY(1.2)"}}>Log In</h6>
            </button>
            <hr />
            <button
              onClick={()=>navigator2()}
              className="rounded-pill text-center text-white p-0 m-0 py-3"
              style={{backgroundColor:"#373063"}}
            >
              <h6 className='p-0 m-0' style={{transform:"scaleY(1.2)"}}>Registration</h6>
            </button>
          </div>
        </div>
      </main>

      <footer className='border w-100 py-4 d-flex flex-column flex-md-row mb-0 justify-content-center justify-content-md-between align-items-center text-center px-3 px-md-4 position-absolute bottom-0 start-0' style={{backgroundColor:"#373063"}}>
        <p className='m-0 text-white fs-6 fs-md-5'>
          © 2026 <b className='p-0 m-0 text-white'>XYZ Student Portal</b>. All rights reserved.
        </p>
      </footer>
    </div>
  )
}