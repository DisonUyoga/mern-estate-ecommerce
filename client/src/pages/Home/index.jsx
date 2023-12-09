import './index.scss'
import Helmet from '../../components/Helmet'
import {Link} from 'react-router-dom'
import {useState, useEffect} from 'react'
import { searchListings } from '../../utils/createListing'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import {Navigation} from 'swiper/modules'
import SwiperCore from 'swiper'
import ListingItem from '../../components/ListingItem'



const Home = () => {
  SwiperCore.use(Navigation)
  const [offerListings, setOfferListings]=useState([])
  const [saleListings, setSaleListings]=useState([])
  const [rentListings, setRentListings]=useState([])
  const [loading, setLoading]=useState()
  const [error, setError]=useState()
  useEffect(()=>{
    setLoading(true)
    const fetchOffer= async()=>{
      try {
        const offer='offer=true&limit=4'
        const res =await searchListings(offer)
        setOfferListings(res)
        setLoading(false)
        fetchRentListings()
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings=async()=>{
      try {
        const type= "type=rent&limit=4"
        const res = await searchListings(type)

        setRentListings(res)
        fetchSaleListings()
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings= async()=>{
      try {
        const type="type=sale&limit=4"
        const res = await searchListings(type)
        setSaleListings(res)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOffer()
  },[])
  
  return <Helmet title="Home">
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next <span className="text-slate-500"> perfect</span><br/>
        place with ease</h1> 
        <div className="text-xs sm:text-sm text-slate-400">
          D&W Estate is the best place to find your next perfect place to live.<br/>
          We have a wide range of properties for you to choose from
        </div>
        <Link className="text-xs sm:text-sm text-blue-800 font-bold hover:underline" to="/search">
            Let's get started...
        </Link>
      </div>
      <Swiper navigation>

      {
        offerListings && offerListings.length>0 && offerListings.map(item=>(
          <SwiperSlide key={item._id}>
            <div style={{background: `url(${item.imageUrls[0]}) center no-repeat`, backgroundSize: "cover"}} className="h-[500px] p-3">
                  
            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>


      <div className="flex flex-col mx-auto max-w-6xl gap-8 my-10 p-3 mx-auto">
          {
            offerListings && offerListings.length>0 && (
              <div className="">

              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to="/search?offer=true">Show more offers</Link>
              </div>

              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map(item=>(
                    <ListingItem key={item._id} listing={item}/>
                  ))
                }
              </div>
              </div>
            )
          } 
          {
            rentListings && rentListings.length>0 && (
              <div className="">

              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
                <Link className="text-sm text-blue-800 hover:underline" to="/search?type=rent">Show more rentals...</Link>
              </div>

              <div className="flex flex-wrap gap-1">
                {
                  rentListings.map(item=>(
                    <ListingItem key={item._id} listing={item}/>
                  ))
                }
              </div>
              </div>
            )
          } 
          {
            saleListings && saleListings.length>0 && (
              <div className="">

              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
                <Link className="text-sm text-blue-800 hover:underline" to="/search?type=sale">Show more sales...</Link>
              </div>

              <div className="flex flex-wrap gap-1">
                {
                  saleListings.map(item=>(
                    <ListingItem key={item._id} listing={item}/>
                  ))
                }
              </div>
              </div>
            )
          }    
      
      </div>
      
    </div>
   
  </Helmet>
}

export default Home;
