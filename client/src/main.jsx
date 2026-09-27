import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { createRoot } from 'react-dom/client'
import SignIn from './SignIn.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'

import StudentPortal from './Component/StudentPortal.jsx'
import StudentProfile from './Component/StudentProfile.jsx'
import DashBoard from './Component/DashBoard.jsx'
import Ragister from './Ragister.jsx'
import AuthProvider from './AuthProvider.jsx'
import PaymentLedger from './Component/PaymentLedger.jsx'
import WaiverInformation from './Component/Waiver.jsx'
import ExamClearance from './Component/ExamClearance.jsx'
import RegisteredCourses from './Component/RegisteredCourse.jsx'
import AcademicResult from './Component/Result.jsx'
import ClassRoutine from './Component/Routine.jsx'
import LiveResult from './Component/LiveResult.jsx'
import TeachingEvaluation from './Component/TeachingEvaluation.jsx'
import Convocation from './Component/Convocation.jsx'
import TransportCardApply from './Component/Tarnsport.jsx'
import Scholarship from './Component/Scholarship.jsx'
import CertificateTranscript from './Component/CertificateTranscript.jsx'
import LearningResources from './Component/LearningResources.jsx'
import StudentServicesHelpDesk from './Component/StudentServices.jsx'
import Notice from './Component/Notice.jsx'
import CourseRegistration from './Component/CourseRegistration.jsx'
import Attendance from './Component/Attendance.jsx'
import AcademicCalendar from './Component/AcademicCalendar.jsx'
import NotificationCenter from './Component/NotificationCenter.jsx'


const router = createBrowserRouter(
  [
  {
  path:'/',
  Component:App
},
{path:'/signin',
  Component:SignIn
},
{
  path:'/Ragister',
  Component:Ragister
},
{
  path:'/student-portal',
  Component: StudentPortal,
  children:[{
index:true,
Component: DashBoard
  },{
path: '/student-portal/StudentProfile',
Component: StudentProfile
  },
{
  path: '/student-portal/PaymentLedger',
Component: PaymentLedger
},
{
  path: '/student-portal/Waiver',
  Component: WaiverInformation
},
{
  path: '/student-portal/ExamClearance',
  Component: ExamClearance
},
{
  path: '/student-portal/RegisteredCourse',
  Component: RegisteredCourses
},
{
  path: '/student-portal/Result',
  Component: AcademicResult
},
{
  path: '/student-portal/Routine',
  Component: ClassRoutine
},
{
  path: '/student-portal/LiveResult',
  Component: LiveResult
},
{
  path: '/student-portal/TeachingEvaluation',
  Component: TeachingEvaluation
},
{
  path: '/student-portal/Convocation',
  Component: Convocation
},
{
  path: '/student-portal/TransportCardApply',
  Component: TransportCardApply
},
{
  path: '/student-portal/Scholarship',
  Component: Scholarship
},
{
  path: '/student-portal/CertificateTranscript',
  Component: CertificateTranscript
},
{
  path: '/student-portal/LearningResources',
  Component: LearningResources
},

{
  path: '/student-portal/StudentServices',
  Component: StudentServicesHelpDesk
},
{
  path: '/student-portal/Notice',
  Component: Notice
},
{
  path: '/student-portal/CourseRegistration',
  Component: CourseRegistration
},
{
  path: '/student-portal/Attendance',
  Component: Attendance
},
{
  path: '/student-portal/AcademicCalendar',
  Component: AcademicCalendar
},
{
  path: '/student-portal/NotificationCenter',
  Component: NotificationCenter
},
]
}]
)



createRoot(document.getElementById('root')).render(
   <AuthProvider>
       <RouterProvider router={router}/>
   </AuthProvider>
)
