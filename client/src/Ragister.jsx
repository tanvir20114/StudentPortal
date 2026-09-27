import React, { use } from 'react'
import backgroundImage from './assets/background.jpg'
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from 'react-router';
import { AuthContext } from './AuthContext';

export default function Ragister(){
    const {createUser} = use(AuthContext);
    const navigate = useNavigate();

    function handleSignIn(e) {
      e.preventDefault();
      const name = e.target.email.value;
      const password = e.target.password.value;
      createUser(name,password).then(result=>{
        navigate('/student-portal');
      }).catch(error=>{
        alert(error)
      })
    }

  return (
    <div style={{height:"100vh", position:"relative", overflow:"hidden"}} className='w-100'>
      <img
        src={backgroundImage}
        alt=""
        style={{height:"100vh", opacity:".1", position:"absolute", top:0, left:0, objectFit:"cover"}}
        className='w-100'
      />
      <div
        className='d-flex align-items-center justify-content-center px-3'
        style={{position:"absolute", minHeight:"100vh", width:"100%", top:0, left:0, overflowY:"auto"}}
      >
        <div className='gap-4 gap-md-5 d-flex flex-column p-4 p-md-5 w-100' style={{maxWidth:"450px"}}>
          <div className='d-flex gap-3 gap-md-4 justify-content-center text-center align-items-center'>
            <h1 className='m-0 fs-2 fs-md-1'><FaUniversity /></h1>
            <h1 className='d-flex flex-column justify-content-center m-0 p-0 fs-3 fs-md-1'>XYZ UNIVERSITY</h1>
          </div>
          <h2 className='fs-4 fs-md-2 text-center text-md-start'>Registration</h2>

          <form onSubmit={handleSignIn}>
            <div className="mb-3 mt-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" className="form-control" id="email" placeholder="Enter email" name='email'/>
            </div>
            <div className="mb-3">
              <label htmlFor="pwd" className="form-label">Password:</label>
              <input type="password" className="form-control" id="pwd" placeholder="Enter password" name='password'/>
            </div>
            <div className="form-check mb-3">
              <label className="form-check-label">
                <input className="form-check-input" type="checkbox" name="remember"/> Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100 w-md-auto">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}