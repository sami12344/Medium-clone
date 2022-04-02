import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Loader from '../components/Loader'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typins'
interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  const [loader, setLoader] = useState(true)
  const loadingComplete = setTimeout(() => setLoader(false), 600)
  if (loader) {
    return <Loader />
  }
  return (
    <main className="">
      <Head>
        <title>Medium</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className="flex items-center justify-center border-y-black  bg-yellow-400 py-10 lg:py-0">
        <div className="space-y-5 px-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="font-extrabold">Medium</span> is a place to write,
            read and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers
          </h2>
        </div>
        <img
          className="hidden h-32 md:inline-flex lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt=""
        />
      </div>
 
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 shadow-black stroke-black">
          {posts.map((post) => {
            return (
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className="group h-full cursor-pointer overflow-hidden rounded-lg border ">
                  <img
                    className=" w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105  "
                    src={urlFor(post.mainImage).url()!}
                    alt=""
                  />
                  <div className="flex justify-between bg-white p-5">
                    <div>
                      <p className="text-lg font-bold">{post.title}</p>
                      <p className="text-xs">
                        {post.description} by {post.author.name}
                      </p>
                    </div>
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={urlFor(post.author.image).url()!}
                      alt=""
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
   
      <Footer></Footer>
    </main>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
_id, title,slug, author ->{
  name, image
},
description,
mainImage,
slug
}`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
