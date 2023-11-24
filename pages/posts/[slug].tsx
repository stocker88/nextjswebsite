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


type Props = {
  post: PostType
  morePosts: Post[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  const title = `${post.title}`
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
                <meta property="og:image" content={'https://www.hellostocker.com'+post.ogImage.url} />
                <meta property="og:description" content={post.seoExcerpt} />
                <meta name="description" property="og:description" content={post.seoExcerpt} />
                <meta name="description" content={post.seoExcerpt}/>
                <meta property="og:title" content={post.title} />
                <meta name="og:description" content={post.seoExcerpt} />
                <link rel="apple-touch-icon" href={'https://www.hellostocker.com'+post.ogImage.url} />
                <meta property="og:url" content={"https://www.hellostocker.com/posts/"+post.slug} />
                <meta name="twitter:title" content={''+post.title}/>
                <meta name="twitter:description" content={post.seoExcerpt}/>
                <meta name="twitter:image" content={'https://www.hellostocker.com'+post.ogImage.url}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <link rel="canonical" href={"https://www.hellostocker.com/posts/"+post.slug} />
              </Head>
              <article className="mb-32">
              <Header />


                <div style={{
                   'position': 'fixed',
                   'bottom': '1rem',
                   'left': '1rem',
                   'backgroundColor': '#00f75f',
                   'border': '1px solid #ccc',
                   'padding': '0.5rem',
                   'boxShadow': '0px 0px 10px rgba(0, 0, 0, 0.2)',
                   'zIndex': '1000', /* Adjust the z-index to ensure it appears above other content */
                   'borderRadius': '30px 30px 30px 30px',
                 }}>

              <FacebookShareButton children={<FacebookIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>
              <div style={{paddingTop:'10px'}}></div>
              <LinkedinShareButton children={<LinkedinIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>
              <div style={{paddingTop:'10px'}}></div>
              <TwitterShareButton children={<TwitterIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>
              <div style={{paddingTop:'10px'}}></div>
              <PinterestShareButton children={<PinterestIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>
              <div style={{paddingTop:'10px'}}></div>
              <RedditShareButton children={<RedditIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>
              <div style={{paddingTop:'10px'}}></div>
              <WhatsappShareButton children={<WhatsappIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>
              <div style={{paddingTop:'10px'}}></div>
              <TelegramShareButton children={<TelegramIcon size={'min(max(5vw,30px),40px)'} round={true} />} url={"https://www.hellostocker.com/posts/"+post.slug}/>

                </div>


              <Container>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }} >
                  Suggested Blog Stories
                </h2>
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

  const content = await markdownToHtml(post.content || '')

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
