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
import Script from 'next/script'
import ReactGA from 'react-ga4';

import {
  FacebookShareButton,
  LinkedinShareButton,

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

    RedditShareCount,

} from "react-share";

type Props = {
  post: PostType
  morePosts: Post[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  const title = `${post.title}`

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the width threshold as needed
    };

    ReactGA.initialize('G-JPXMZYD5DY');
    const intervalId = setInterval(() => {
      if (window.gtag) {
        clearInterval(intervalId);
        console.log('gtagslug');
        // Replace with your analytics tracking code
        window.gtag('config', 'G-JPXMZYD5DY', {
          page_title: post.slug,
          page_location: window.location.href,
          page_path: location.pathname,
          screen_name: post.slug,
        });
      } else {
        console.log('no gtagslug');
        }
    }, 100);


    handleResize(); // Set initial state based on window width

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
                <link rel="shortcut icon" href="favicon.ico"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="hsl(200, 100%, 48%)" />
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
                    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JPXMZYD5DY"/>
                    <Script>
                      {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag() {
                        window.dataLayer.push(arguments);
                      }
                      gtag('js', new Date());
                      gtag('config', 'G-JPXMZYD5DY');
                      `}
                    </Script>
              </Head>
              <div>
             <center>
                     <Header
                     slug={post.slug}
                   />


                   <h2  style={{ color: 'white',fontWeight: 600, fontSize: "min(20px,max(18px,3.5vw))", lineHeight: 1.3,textShadow: '0px 0px 5px rgba(1, 0, 1, 0.7)', maxWidth: "650px" }} >
                  Maximize Profits: our cutting-edge AI sends you hot stocks to buy before they blow up!
                  </h2>
                  <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
                  <NewsletterSignUp from={post.slug}/>

                  <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>

             </center>
            </div>
              <article className="mb-32">




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
                                            <QuoteDisplay from={'inspiration_button_'+post.slug}/>

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
