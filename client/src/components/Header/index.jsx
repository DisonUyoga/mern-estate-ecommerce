import "./index.scss"
import {FaSearch} from "react-icons/fa"
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {getCurrentUser, signInError} from '../../features/slices/userSlice'

import {useState, useEffect} from 'react';
const nav__links=[
  {
    display:"Home",
    path:"."
  },
  {
    display:"About",
    path:"about"
  }
  
]
const Header = () => {
  const {currentUser}=useSelector(state=>state.user)
  const navigate=useNavigate()
  const [searchTerm ,setSearchTerm]=useState("")

  const handleSubmit=(e)=>{
    e.preventDefault()
    const urlParams= new URLSearchParams(window.location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuery= urlParams.toString()
    navigate(`/search?${searchQuery}`)


  }
  useEffect(()=>{
    const urlParams= new URLSearchParams(location.search)
    const searchTermFromUrl=urlParams.get("searchTerm")
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])
  return <header className="bg-slate-200">
  <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
  <Link to="/">
  <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
  <span className="text-slate-500">D&W</span>
  <span className="text-slate-700">Estate</span>
  </h1>
</Link>

  <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg p-3 flex items-center">
  <input className="bg-transparent focus:outline-none w-24 sm:w-64  " 
  type="text" placeholder="Search..."
  onChange={(e)=>setSearchTerm(e.target.value)}
  value={searchTerm}
  /> 
  <button>
  <FaSearch className="text-slate-500"/>
  </button>
  
  </form>

  <ul className="flex gap-4">

  {
    nav__links.map((item, index)=>(
      <Link to={item.path} key={index} className="hidden sm:inline text-slate-700 hover:underline">{item.display}</Link>
    ))
  }
  <Link to="/profile">
  {
    currentUser?.avatar?<img src={currentUser.avatar} alt="profile" className="h-7 w-7 rounded-full object-cover"/>:<li className="text-slate-700 hover:underline"> Sign in</li>
  }
  </Link>
  </ul>

   
  </div>
  </header>
  
}

export default Header;
