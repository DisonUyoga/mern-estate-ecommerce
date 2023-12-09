import {Navigate, Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'


const ProtectedRoute = () => {
  const {currentUser}=useSelector(state=>state.user)
  return currentUser?<Outlet/>:<Navigate to="/signin"/>
   
  }
export default ProtectedRoute;
