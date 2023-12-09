import './index.scss'

import Helmet from '../../components/Helmet'
import { useState, useEffect } from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import { searchListings } from '../../utils/createListing'
import ListingItem from '../../components/ListingItem'



const Search = () => {
  const navigate= useNavigate()
  const [error, setError]=useState(false)
  const [loading, setLoading]=useState(false)
  const [listings, setListings]=useState([])
  const [search, setSearch]=useState(location.search)
  const [showMore, setShowMore]=useState(false)
  const [searchParams, setSearchParams]=useSearchParams()
  const [sideBar, setSideBarData]=useState({
    searchTerm:"",
    type:"all",
    parking: false,
    furnished:false,
    offer:false,
    sort:"created_at",
    order:"desc"
  })
const searchParam=searchParams.get("searchTerm")
useEffect(()=>{
  
  const urlParams= new URLSearchParams(location.search)
  const searchTermFromUrl=urlParams.get("searchTerm")
  const typeFromUrl=urlParams.get("type")
  const offerFromUrl=urlParams.get("offer")
  const furnishedFromUrl=urlParams.get("furnished")
  const parkingFromUrl=urlParams.get("parking")
  const sortFromUrl=urlParams.get("sort")
  const orderFromUrl=urlParams.get("order")
  if(searchTermFromUrl || typeFromUrl || offerFromUrl || furnishedFromUrl || parkingFromUrl || sortFromUrl || orderFromUrl
  ){
    setSideBarData({
      searchTerm: searchTermFromUrl || "",
      type: typeFromUrl || "all",
      furnished: furnishedFromUrl==="true"?true:false,
      parking: parkingFromUrl==="true"? true:false,
      offer: offerFromUrl==='true'? true:false,
      sort: sortFromUrl || "created_at",
      order: orderFromUrl || "desc"

    })
  
  }
  const searchQuery= urlParams.toString()
  
  const fetchData= async()=>{
    setLoading(true)
    setShowMore(false)
    const res=await searchListings(searchQuery)
    if(res.length>8){
      setShowMore(true)
    }else{
      setShowMore(false)
    }
    if(res){
      setLoading(false)
      setListings(res)
    }else{
      setLoading(false)
      setError(true)
    }
  }
 
  fetchData()
  

},[location.search])

const handleChange=(e)=>{
  const {value,id, checked}= e.target
  if(id==="all" || id==='rent' || id=== "sale"){
    setSideBarData({...sideBar, type: id})
  }
  if(id==="searchTerm"){
    setSideBarData({...sideBar, searchTerm: value})
  }
  if(id==="parking" || id ==="furnished" || id==="offer"){
    setSideBarData({...sideBar, [id]:checked || checked === "true" ? true : false })
  }
  if(id==="sort_order"){
    const sort = value.split("_")[0] || "created_at"
    const order=value.split('_')[1] || "desc"
    setSideBarData({...sideBar, sort,order})
    
  }
  

}

const handleSubmit= async(e)=>{
  e.preventDefault()
  const urlParams= new URLSearchParams()
  urlParams.set("searchTerm", sideBar.searchTerm)
  urlParams.set("type", sideBar.type)
  urlParams.set("parking", sideBar.parking)
  urlParams.set("furnished", sideBar.furnished)
  urlParams.set("offer", sideBar.offer)
  urlParams.set("order", sideBar.order)
  urlParams.set("sort", sideBar.sort)
  const searchQuery=urlParams.toString()
  navigate(`/search/?${searchQuery}`)
  
}
const onShowMoreClick=async()=>{
  const numberOfListings= listings.length
  const startIndex=numberOfListings
  const urlParams=new URLSearchParams(location.search)
  urlParams.set('startIndex', startIndex)
  const searchQuery= urlParams.toString()
  console.log(searchQuery)
  const res= await searchListings(searchQuery)
if(res.length<9){
  setShowMore(false)
}
  console.log(res)
 setListings(prev=>{
  return [
    ...prev,
    ...res
  ]
 })
console.log(listings)
}
  return <Helmet title="Search">
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>Search term:</label>
                <input type="text" 
                id="searchTerm"
                value={sideBar.searchTerm}
                placeholder='Search...'
                className="border rounded-lg p-3 w-full" 
                  onChange={handleChange}
                />
                </div>

                <div className="flex gap-2 flex-wrap text-center">
                  <label className="font-semibold">Type:</label>
                  <div className="flex gap-2">
                    <input 
                    id="all"
                    value={sideBar.type}
                    type="checkbox" className="w-5" 
                      checked={sideBar.type==='all'}
                      onChange={handleChange}
                    />
                    <span>Rent & Sale</span>
                  </div>

                  <div className="flex gap-2">
                    <input 
                    id="offer"
                    checked={sideBar.offer}
                    type="checkbox" className="w-5" 
                    onChange={handleChange}
                    />
                    <span>Offer</span>
                  </div>

                  <div className="flex gap-2">
                    <input 
                    id="rent"
                      checked={sideBar.type==="rent"}
                    type="checkbox" className="w-5" 
                    onChange={handleChange}
                    />
                    <span>Rent</span>
                  </div>

                  <div className="flex gap-2">
                    <input 
                    id="sale"
                    type="checkbox" 
                    checked={sideBar.type==="sale"}
                    onChange={handleChange}
                    className="w-5" />
                    <span>Sale</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap text-center">
                  <label className="font-semibold">Amenities:</label>
                  <div className="flex gap-2">
                    <input 
                    id="parking"
                    checked={sideBar.parking}
                    onChange={handleChange}
                    type="checkbox" className="w-5" />
                    <span>Parking</span>
                  </div>

                  <div className="flex gap-2">
                    <input 
                    id="furnished"
                    checked={sideBar.furnished}
                    onChange={handleChange}
                    type="checkbox" className="w-5" />
                    <span>Furnished</span>
                  </div>
                  
                                  
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold">Sort</label>
                    <select 
                    defaultValue="created_at_desc"
                    onChange={handleChange}
                    className="border rounded-lg p-3"
                    id="sort_order">
                    <option value="regularPrice_desc">Price high to low</option>
                    <option value="regularPrice_asc">Price low to high</option>
                    <option value="createdAt_desc">Latest</option>
                    <option value="createdAt_asc">Oldest</option>

                    </select>
                  </div>

                  <button className=' bg-slate-700 p-3 text-white w-full rounded-lg uppercase hover:opacity-95 disabled:opacity-85 '>Search</button>
                  
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing results:</h1>
       <div className="p-7 flex flex-wrap gap-4">
        {!loading && listings?.length===0 && (<p className="text-center text-slate-700">No listing found!</p>)}
        {
          loading && <p className="text-center text-slate-700 w-full">Loading...</p>
        }
        {
          !loading && listings.length!==0 && listings?.map(listing=>(
            <ListingItem key={listing._id} listing={listing}/>
          )) 
        }
       
       
       </div>
       <div className="flex items-center justify-center p-7 ">
       {
        showMore && <button className='mx-auto' onClick={()=>{
          onShowMoreClick()
        }}>Show more...</button>
       }
       </div>
      </div>
    </div>
  </Helmet>
}

export default Search;
