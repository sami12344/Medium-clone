import { GetStaticProps } from 'next'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typins'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'
import Head from 'next/head'
interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string 
}
interface Props {
  post: Post
}
function Post({ post }: Props) {

  const [submitted, setSubmitted] = useState(false)
  const {register,handleSubmit,formState:{ errors }} = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
      console.log(data);
      
  }

  const [loader, setLoader] = useState(true)
  const loadingComplete = setTimeout(() => setLoader(false), 500)
  if (loader) {
    return <Loader />
  }
  return (
    <main>
      <Head>
        <title>{post.title}</title>
        <link
          rel="jpg"
          href="../../images/logo.jpg"
        />
      </Head>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by
            <span className="font-semibold text-green-600">
              {post.author.name}
            </span>
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATABASE!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />
      {submitted ? (
        <div className="my-10  mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10  text-white">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below</p>
        </div>
      ) : (
        <form
          action=""
          className="mx-auto mb-10 flex max-w-2xl flex-col px-3 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="text"
              placeholder="Sami"
            />
          </label>

          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="email"
              placeholder="Sami@gmail.com"
            />
          </label>

          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              rows={8}
            ></textarea>
          </label>
          <div>
            {errors.name && (
              <div>
                <span className="text-red-500">
                  - The Name Field is required
                </span>
                <br />
              </div>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment Field is required
              </span>
            )}

            {errors.email && (
              <div>
                <span className="text-red-500">
                  - The Email Field is required
                </span>
                <br />
              </div>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      {/* Comment */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500 ">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comment.map((comment) => {
          return (
            <div className="py-2" key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}:</span>{' '}
                {comment.comment}
              </p>
            </div>
          )
        })}
      </div>
      <Footer></Footer>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{_id,slug{current}}`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
_id,
_createdAt,
  title,
  author -> {
  name,
  image
},
 'comment': *[_type == "comment" && post._ref == ^._id && approved == true],
description,
mainImage,
slug,
body
}

`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 30,
  }
}
