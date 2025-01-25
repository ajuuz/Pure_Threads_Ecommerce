import { useEffect, useState } from "react"
import CropperComponent from "@/components/AdminComponent/CropperComponent"
import { Button } from "@/components/ui/button"
import { FaImage, FaPlus } from "react-icons/fa"
import { GiClick } from "react-icons/gi"
import { Star } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Rating from "./Rating"
import { formDatasubmission } from "@/Utils/formDataSubmission"
import { getCroppedImg } from "@/Utils/cropImage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IoClose } from "react-icons/io5"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import PaginationComponent from "@/components/CommonComponent/PaginationComponent"
import { getReviews, voteReview } from "@/api/User/reviewApi"
import { dateFormatter } from "@/Utils/dateFormatter/dateFormatter"
import spinner from '../../../assets/Spin@1x-1.0s-200px-200px.svg'

export const ReviewTab=({productId})=>{
    const [tab,setTab]=useState("displayReview")
    return(
        <div>
            {tab==="addReview"
            ?<AddReview productId={productId}/>
            :<DiplayReview productId={productId}/>
            }
            <Button onClick={tab==="displayReview"?()=>setTab("addReview"):()=>setTab("displayReview")}>{tab==="displayReview"?"VIEW REVIEW":"ADD A REVIEW"}</Button>
        </div>
    )
}

const AddReview=({productId})=>{

    const [review,setReview]=useState("")
    const [rating, setRating] = useState(0)
    const [errors,setErrors]=useState({
        ratingError:"",
        reviewError:""
    })
    const [loading,setLoading]=useState(false)

    const [images,setImages]=useState([])
    const [croppedImage,setCroppedImage]=useState([])
    const [showCropper,setShowCropper]=useState(null)
   
    const handleAddImageInputField=()=>{
        if(images.length>=3) return;
        setImages((prev)=>[...prev,null])
        setCroppedImage((prev)=>[...prev,null])
    }

    const handleRemoveImageInput=(index)=>{
        setImages((prev)=>prev.filter((_,ind)=>index!==ind))
        setCroppedImage((prev)=>prev.filter((_,ind)=>index!==ind))
    }

    const handleImageInputChange=(index,e)=>{
        console.log(index)
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload=()=>{
                const updatedImages = [...images];
                updatedImages[index] = reader.result;
                setImages(updatedImages);
                setShowCropper(index);
          }
          reader.readAsDataURL(file);
        }
    }

    const handleCropDone = async (croppedAreaPixels,zoom,image,index) => {
        const croppedImg = await getCroppedImg(image, croppedAreaPixels, zoom);
        setCroppedImage((prev) => {
          const updated = [...prev]; // Make a shallow copy of the array
          updated[index] = croppedImg; // Replace the value at the specific index
          return updated; // Return the updated array
        });
        setShowCropper(null);
      };
      
      const handleCancel = () => {
        setShowCropper(null);
      };

      const handleAddReview=async()=>{

          const errorObject =validation(rating,review);
          if(Object.keys(errorObject).length>0)
          {
              setTimeout(()=>{
                  console.log("working after 3000")
                  setErrors({ratingError:"",reviewError:""})
                  },3000)
            return;
          } 
        
          try{
             const formData = {productId,rating,review}
             setLoading(true);
             const addREviewResult=await formDatasubmission(croppedImage,formData,"review")
             toast.success(addREviewResult.message)
             setLoading(false)
            }
            catch(error)
            {
                setLoading(false)
                toast.error(error.message)
            }
      }

      const validation=()=>{
        const errors={};
        if(rating===0) errors.ratingError="Rate the Product to Continue"
        if(!review.trim()) errors.reviewError="review cannot be empty"
        else if(/^[A-Za-z\s]{4,}$/.test(review)===false) "review should have more than 3 alphabets"
        setErrors(errors);
        return errors;
      }


    return(
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
                <h1 className='text-lg font-semibold mt-5 text-center'>Write a Review</h1>
                <div className='space-y-4'>
                    <div>
                        <Label htmlFor="rating">Rating {errors?.ratingError && <span className="text-red-400">({errors?.ratingError})</span>}</Label>
                        <Rating rating={rating} setRating={setRating}/>
                    </div>
                    <div>
                        <Label htmlFor="review">Your Review {errors?.reviewError && <span className="text-red-400">({errors?.reviewError})</span>}</Label>
                        <Textarea
                          id="review"
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here"
                        required
                        />
                    </div>
                </div>

                <div>
                    <Label>Add Images (optional) <span className='text-xs text-muted-foreground'>Click the below to add Images</span></Label>
                    <div className='flex gap-4'>
                        {
                            images.map((image,index)=>(
                            <div className='cursor-pointer'>
                                {showCropper==index && <CropperComponent image={image} onCropDone={handleCropDone} onCancel={handleCancel} index={index} isProductImage={true}/>}
                                <div  className=' border-2 mt-3 border-dashed rounded-md w-fit flex flex-col gap-4 justify-center p-4 relative'>
                                    <div onClick={()=>handleRemoveImageInput(index)} className='bg-black w-fit rounded-lg text-white font-semibold absolute top-2 right-2'><IoClose/></div>
                                    <div className='bg-slate-200 rounded-md px-7 py-5 '>
                                        {croppedImage[index]
                                        ?<img src={URL.createObjectURL(croppedImage[index])} alt="Cropped" className="w-16 rounded-md"/>
                                        :<FaImage className="mx-auto" />
                                        }
                                    </div>
                                    <Input  id={`images-${index}`} type="file"  accept="image/*" onChange={(e)=>handleImageInputChange(index,e)} multiple className={`mt-1 hidden`} />

                                   <Button variant="outline" className="m-0 h-7 relative">
                                        <Label htmlFor={`images-${index}`} >
                                        Add
                                        <GiClick className='absolute -right-0 -bottom-1'/>
                                        </Label>
                                   </Button>
                                </div>
                            </div>
                            ))
                        }

                        {images.length<3 &&
                        <div onClick={handleAddImageInputField} className='cursor-pointer border-2 mt-3 border-dashed rounded-md w-fit flex justify-center items-center py-4 px-12'>
                            <FaPlus className=''/>
                        </div>
                        }
                    </div>
                </div>
                
                
            </div>
            <Button disabled={loading} onClick={handleAddReview}>{loading?<img className='scale-50' src={spinner} alt="Loading..."/>:"Submit"}</Button>
        </div>
    )
}

const DiplayReview=({productId})=>{
    const [reviews,setReviews]=useState([])
    const [numberOfPages,setNumberOfPages]=useState(1)
    const [currentPage,setCurrentPage]=useState(1);
    const [userId,setUserId]=useState(null)

    useEffect(()=>{
        const fetchReviews=async()=>{
            try{
                const reviewResult=await getReviews(productId);
                console.log(reviewResult.reviews)
                setReviews(reviewResult.reviews);
                setUserId(reviewResult?.userId)
            }catch(error)
            {
                toast.error(error.message)
            }
        }
        fetchReviews()
    },[])

    const handleVote=async(reviewId,index,status,helpfulUsers)=>{
        if(status==="helpful" && helpfulUsers.some(id=>id===userId)) return;
        try{
            const handleVoteResult = await voteReview(reviewId,status)
            toast.success(handleVoteResult.message)
            if(status==="helpful"){
                setReviews((prev)=>{
                    const updatedReview = [...prev];
                    if (!updatedReview[index].helpfulUsers.includes(userId)) {
                        updatedReview[index].helpfulUsers.push(userId);
                    }
                    return updatedReview;
                })
            }else{
                setReviews((prev)=>{
                    const updatedReview = [...prev];
                    const updatedHelpfulUsers=helpfulUsers.filter(id=>userId!==id);
                    updatedReview[index].helpfulUsers=updatedHelpfulUsers
                    return updatedReview;
                })
            }
        }catch(error)
        {
            toast.error(error.message)
        }
    }

    
    return(
        <div className='flex flex-col gap-5'>
            <h2 className='text-lg font-semibold mt-5 text-center'>Customer Reviews</h2>

             {
                reviews?.map((review,index)=>(
                    <div>
                    <div className='border rounded-md p-4 flex flex-col gap-5'>
                        <div className='flex items-center gap-4'>
                            <span className='inline-block bg-black rounded-3xl py-[6px] px-[13px] text-white font-semibold'>{review?.userId?.name.slice(0,1)}</span>
                            <div>
                                <p>{review?.userId?.name}</p>
                                <div className='flex gap-2'>
                                    <div className='flex items-center'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review?.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                        />
                                    ))}
                                    </div>                           
                                      {dateFormatter(review.createdAt)}
                                </div>
                            </div>
                        </div>
    
                        <div>
                            <p>{review?.review}</p>
                        </div>
                        <div>
                            <div className='flex gap-5'>
                                {review?.imageURLs.length>0 && 
                                    review?.imageURLs.map((image)=>(
                                        <img src={image?.url} className='w-14  rounded' alt="" />
                                    ))
                                }
                            </div>
                        </div>
    
                        <div className='flex items-center gap-5'>
                            <p>Was this review Helpful</p>
                            <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`mr-2 `}
                                    onClick={() => handleVote(review?._id,index,"helpful",review?.helpfulUsers)}
                                  >
                                  Yes ({review?.helpfulUsers.length} )
                                </Button>
                                  {review?.helpfulUsers.some(id=>id===userId) &&
                                    <Button
                                    variant="outline"
                                    size="sm"
                                    className={`mr-2 `}
                                    onClick={() => handleVote(review?._id,index, "notHelpful",review?.helpfulUsers)}
                                    >
                                      No 
                                    </Button>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
                ))
             }   
           
            <PaginationComponent/>

        </div>
    )
}