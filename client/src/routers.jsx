import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import Login,{action as loginAction} from './pages/Login'
import Signin, {action as signupAction} from './pages/Signin'
import About from './pages/About'
import Listing from './pages/Listing'
import EditListing from './pages/EditListing'
import Search from './pages/Search'
import ListingDetail from './pages/ListingDetail'
import Home from './pages/Home'

export const router=createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>}>
  <Route index element={<Home/>}/>
  <Route path="login" element={<Login/>} action={loginAction}/>
  <Route path="signin" element={<Signin/>} action={signupAction}/>
  <Route element={<ProtectedRoute/>}>
  <Route path="profile" element={<Profile/>}/>
  <Route path="create-listing" element={<Listing/>}/>
  <Route path="edit/:id" element={<EditListing/>}/>
  </Route>
  <Route path="listing/:id" element={<ListingDetail/>}/>
  <Route path="about" element={<About/>}/>
  <Route path="search" element={<Search/>}/>
  
  </Route>
))