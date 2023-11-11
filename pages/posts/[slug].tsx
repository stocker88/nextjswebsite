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

type Props = {
  post: PostType
  morePosts: PostType[]
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
                <meta name="description" content="Some tips on How to Make Money"/>
                <meta property="og:image" content={'https://www.hellostocker.com'+post.ogImage.url} />
                <meta property="og:description" content="AI powered Virtual Trading App that sends you stocks and cryptos to buy now: We analyze hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox and Palantir" />
                <meta name="description" property="og:description" content="AI powered Virtual Trading App that sends you stocks and cryptos to buy now: We analyze hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox and Palantir" />
                <meta name="description" content="AI powered Virtual Trading App that sends you stocks and cryptos to buy now: We analyze hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox and Palantir"/>
                <meta property="og:title" content={post.title} />
                <meta name="og:description" content="AI powered Virtual Trading App that sends you stocks and cryptos to buy now: We analyze hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox and Palantir" />
                <link rel="apple-touch-icon" href={'https://www.hellostocker.com'+post.ogImage.url} />
                <meta property="og:url" content={"https://www.hellostocker.com/posts/"+post.slug} />
                <meta name="twitter:title" content={''+post.title}/>
                <meta name="twitter:description" content="AI powered Virtual Trading App that sends you stocks and cryptos to buy now: We analyze hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox and Palantir"/>
                <meta name="twitter:image" content={'https://www.hellostocker.com'+post.ogImage.url}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <link rel="canonical" href={"https://www.hellostocker.com/posts/"+post.slug} />
              </Head>
              <article className="mb-32">
              <Header />
              <Container>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
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
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
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
