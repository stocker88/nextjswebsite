import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'
import Post from '../../interfaces/post'
import MoreStories from '../../components/more-stories'
import QuoteDisplay from '../../components/inspiration';
import { useState, useEffect } from 'react';
import NewsletterSignUp from '../../components/formStocker'
import Image from 'next/image';

import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
    FacebookIcon,
    InstapaperIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    TwitterIcon,
    WhatsappIcon,
    TelegramIcon,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookShareCount,
    PinterestShareCount,
    RedditShareCount,

} from "react-share";


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU",
  authDomain: "stocker-fcda2.firebaseapp.com",
  projectId: "stocker-fcda2",
  storageBucket: "stocker-fcda2.appspot.com",
  messagingSenderId: "269261832880",
  appId: "1:269261832880:web:4b6affd899a01f5f0cf175",
  measurementId: "G-WXHHGB6FSV"
};

// Initialize Firebase
//const firebaseApp = initializeApp(firebaseConfig);

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

type Props = {
  post: PostType
  morePosts: Post[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  const title = `${post.title}`

  const [isMobile, setIsMobile] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the width threshold as needed
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScaleFactor = Math.min(scrollY / 400, 1); // Adjust the divisor for a faster or slower scaling effect
      setScaleFactor(newScaleFactor);
    };

    window.addEventListener('scroll', handleScroll);

    handleResize(); // Set initial state based on window width

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
              <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
                <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
                <link rel="shortcut icon" href="favicon.ico"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#00D9FF" />
                <meta name="description" content={post.seoExcerpt}/>
                <meta property="og:image" content={'https://www.stockstobuynow.ai'+post.ogImage.url} />
                <meta property="og:description" content={post.seoExcerpt} />
                <meta name="description" property="og:description" content={post.seoExcerpt} />
                <meta name="description" content={post.seoExcerpt}/>
                <meta property="og:title" content={post.title} />
                <meta property="og:type" content="summary_large_image"/>
                <meta name="og:description" content={post.seoExcerpt} />
                <link rel="apple-touch-icon" href={'https://www.stockstobuynow.ai'+post.ogImage.url} />
                <meta property="og:url" content={"https://www.stockstobuynow.ai/posts/"+post.slug} />
                <meta name="twitter:title" content={post.title}/>
                <meta name="twitter:text:title" content={post.title}/>
                <meta name="twitter:description" content={post.seoExcerpt}/>
                <meta name="twitter:image" content={'https://www.stockstobuynow.ai'+post.ogImage.url}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <link rel="canonical" href={"https://www.stockstobuynow.ai/posts/"+post.slug} />
              </Head>
              <div>
             <center>
                     <Header
                     slug={post.slug}
                   />


                   <h2  style={{ color: 'white',fontWeight: 600, fontFamily: 'arial',fontSize: "min(20px,max(18px,3.5vw))", lineHeight: 1.3,textShadow: '0px 0px 5px rgba(1, 0, 1, 0.7)', maxWidth: "650px" }} >
                  Maximize Profits, Minimize Risks. Our cutting-edge AI stock recommendations outperform the market. Unleash financial success!
                  </h2>
                  <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
                  <NewsletterSignUp from={post.slug}/>

                  <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
                <Image
                  src='/assets/images/usersRating.webp'
                  alt="AI Financial Advisor & Virtual Investing App sends you hot stocks to watch and buy now: find the next Nvidia, Tesla, Roblox before they skyrocket"
                  priority={true}
                 width={200}
                 height={50}
                  />

                <div style={{ color: 'lightGrey', fontSize: "min(14px,max(13px,1.3vw))", fontFamily: 'arial', lineHeight: 1,maxWidth: "350px",textShadow: '5px 5px 5px rgba(0, 0, 0, 0)' }} className="reveal-from-bottom" data-reveal-delay="150">
                    Join a community of millionnaires
                </div>
                <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
             </center>
            </div>
              <article className="mb-32">



                <div style={{
                  'position': 'fixed',
                  'bottom': '1rem',
                  'left': isMobile ? '5%' : 'min(50px, 1vw)',
                  'backgroundColor': 'rgba(18, 18, 18, 0.9)', /* Dark color with opacity */
                  'padding': 'min(10px, 0.8vw)',
                  'boxShadow': '0px 0px 8px rgba(255, 255, 255, 0.4)', /* Lighter shadow for dark mode */
                  'zIndex': '100',
                  'borderRadius': '30px',
                  'display': 'flex',
                  'flexDirection': isMobile ? 'row' : 'column',
                  'whiteSpace': isMobile ? 'nowrap' : 'normal',
                  'overflowX': isMobile ? 'auto' : 'visible',
                  'justifyContent': isMobile ? 'center' : 'flex-start',
                  transform: `scale(${scaleFactor})`,
                }}>
            <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <FacebookShareButton aria-label="Facebook" children={<FacebookIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <LinkedinShareButton aria-label="Linkedin" children={<LinkedinIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <TwitterShareButton aria-label="Twitter" children={<TwitterIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <PinterestShareButton aria-label="Pinterest" children={<PinterestIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug} media={'https://www.stockstobuynow.ai'+post.ogImage.url}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <RedditShareButton aria-label="Reddit" children={<RedditIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <WhatsappShareButton aria-label="Whatsapp" children={<WhatsappIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <TelegramShareButton aria-label="Telegram" children={<TelegramIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai/posts/"+post.slug}/>

                </div>

                <br></br>
              <Container>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
              <br></br>
              <br></br>
              <br></br>
                                            <QuoteDisplay/>

                              <br></br>
                              <br></br>
                              <br></br>
                              <br></br>
                              <br></br>
                              <br></br>
                              <br></br>
                              <br></br>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
                  Suggested Blog Stories
                </h2>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              <MoreStories posts={morePosts} />

              </Container>
            </article>
          </>
        )}
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {

  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'excerpt',
    'seoExcerpt',
    'coverImage',
  ]).filter((e)=>e.slug!=params.slug && e.slug!='privacypolicy')

  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'seoExcerpt',
    'coverImage',
  ])

  const content = post.content

  return {
    props: {
      post: {
        ...post,
        content,
      },
      morePosts:allPosts,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
