import React from 'react'
import Image from 'next/image'
import loader from '../images/redirecting-loader.webp'
const Loader = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-customyellow">
      <Image layout='intrinsic' src={loader} alt="" />
    </div>
  )
}

export default Loader