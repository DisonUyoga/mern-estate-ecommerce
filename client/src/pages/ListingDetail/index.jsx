import './index.scss'

import {useEffect, useState} from 'react';
import Helmet from '../../components/Helmet'
import Contact from '../../components/Contact'
import {listingItem} from '../../utils/createListing'
import {useParams} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import {useSelector} from 'react-redux'
import 'swiper/css/bundle'
const ListingDetail = () => {
  SwiperCore.use(Navigation)
  const {currentUser}= useSelector(state=>state.user)
  const [listing, setListing]=useState(null)
  const [loading, setLoading]=useState(false)
  const [copied, setCopied]=useState(false)
  const [contact, setContact]=useState()
  const [error, setError]=useState(false)
  const {id}=useParams()
  useEffect(()=>{
    const fetchListing=async()=>{
      setError(false)
      setLoading(true)
      try {
        const listing=await listingItem(id)
      if(!listing?.name){
        setError(true)
        setLoading(false)
          return
      }
      setListing(listing)
      setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchListing()
  },[id])
console.log(listing?.regularPrice)
console.log(listing?.discountPrice)
  return <Helmet title="Listing Detail">
    <div className="">
    {loading && <p className='text-center font-semibold'>Loading...</p>}
    
      {error && <p className='text-3xl font-semibold text-center'>Something went wrong!</p>}
      {listing && !error && !loading && (
        <div>
          <Swiper navigation>
            {
              listing.imageUrls.map((url, index)=>(
                <SwiperSlide key={index}>
                  <div className="h-[550px]" style={{background:`url(${url}) center no-repeat`, backgroundSize: "cover"}}></div>
                </SwiperSlide>
              ))
            }
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full h-12 w-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className='text-slate-500'
              onClick={()=>{
                navigator.clipboard.writeText(window.location.href)
                setCopied(true)

                setTimeout(()=>{
                  setCopied(false)
                },2000)
              }}
            />
          </div>
          {copied && <p className="fixed top-[23%] z-10 right-[5%] rounded-md bg-slate-100 p-2">
            Link Copied!
          </p>}
        </div>
      )}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p>
          {listing?.name}-Ksh.{' '}
          {listing?.sale? listing?.regularPrice.toLocaleString("en-KE"): listing?.regularPrice.toLocaleString("en-KE")}{
            listing?.type==='rent' && '/month'
          }
        </p>
        <p className='flex items-center mt-6 gap-2 text-sm text-slate-600'>
        <FaMapMarkedAlt
          className='text-green-700'
        />
          {listing?.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center rounded-md">
            {listing?.type==='rent'? "For rent":"For sale"}
          </p>
          {
            listing?.offer && (
              <p className="bg-green-900 w-full max-w-[200px] text-white text-center rounded-md">Ksh {listing?.discountPrice} Discount</p>
            )
          }
        </div>
      <p className='text-slate-500'><span className='text-black text-semibold '>Description- </span>{listing?.description}</p>
      <ul className="text-green-900 text-sm font-semibold flex flex-wrap gap-4 sm:gap-6">
        <li className='flex items-center whitespace-nowrap gap-1 '>
          <FaBed className="text-lg"/>
          {listing?.bedrooms > 1? `${listing?.bedrooms} beds`: `${listing?.bedrooms} bed`}
        </li>
        <li className='flex items-center whitespace-nowrap gap-1 '>
          <FaBath className="text-lg"/>
          {listing?.bathrooms > 1? `${listing?.bathrooms} baths`: `${listing?.bathrooms} bath`}
        </li>

        <li className='flex items-center whitespace-nowrap gap-1 '>
          <FaParking className="text-lg"/>
          {listing?.parking? "Parking": "No Parking"}
        </li>

        <li className='flex items-center whitespace-nowrap gap-1 '>
          <FaChair className="text-lg"/>
          {listing?.furnished? "Furnished": "Unfurnished"}
        </li>
      </ul>
      {currentUser && listing?.userRef !== currentUser?._id && !contact && <button className="bg-slate-700 rounded-lg p-3 hover:opacity-95 disabled:opacity-85 text-white uppercase" onClick={()=>setContact(true)}>Contact Landlord</button>}

      {contact && <Contact listing={listing}/>}
      
      </div>

    </div>
  </Helmet>
} 
 
export default ListingDetail;
