import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import Post from '../interfaces/post'
import Home from '../views/Home';
//import './App.css';
import ReactGA from 'react-ga4';

type Props = {
  allPosts: Post[]
}
ReactGA.initialize('G-JPXMZYD5DY');

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.send("pageview");
};


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

export default function Index({ allPosts }: Props) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(0,-1)
  return (
    <>
       <Layout>
       {morePosts.length > 0 && <Home posts={morePosts} />}

        <Head>

         <script type="application/ld+json"
            dangerouslySetInnerHTML={{ __html:
                  JSON.stringify({
                      "@context": "http://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "HelloStocker AI Trading Advisor App ChatGPT Powered",
                      "image": "https://www.hellostocker.com/assets/images/hellostocker.webp",
                      "author": {
                        "@type": "Person",
                        "name": "Stocks To Buy Now"
                      },
                      "applicationCategory": "Investing",
                      "screenshot": [
                        "https://www.hellostocker.com/assets/images/chatgpt.webp",
                        "https://www.hellostocker.com/assets/images/portfolio.webp",
                        "https://www.hellostocker.com/assets/images/tslavsrace.webp",
                        "https://www.hellostocker.com/assets/images/dividends.webp"
                      ],
                      "review": {
                        "@type": "Review",
                        "author": {
                          "@type": "Person",
                          "name": "itsjayhi"
                        },
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": "5/5"
                        },
                        "reviewBody": "HelloStocker is an amazing virtual investing app! Their AI Advisor helps me find the best stocks to invest in. +++ recommend HelloStocker"
                      }
                    })}}
                />
          <title>Best Stocks To Buy Now with AI</title>
          <meta charSet="utf-8" />
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" property="og:description" content="HelloStocker helps you find stocks before they blow up: test investing strategies with virtual trading, learn how to invest with AI and grow with the stock market today" />
          <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#00D9FF" />
          <meta name="description" content="HelloStocker helps you find stocks before they blow up: test investing strategies with virtual trading, learn how to invest with AI and grow with the stock market today"/>
          <meta property="og:title" content="HelloStocker AI App - Best Stocks To Buy Now" />
          <meta name="og:description" content="HelloStocker helps you find stocks before they blow up: test investing strategies with virtual trading, learn how to invest with AI and grow with the stock market today" />
          <meta property="og:type" content="video.movie" />
          <meta property="og:url" content="https://www.hellostocker.com/" />
          <meta property="og:image" content="https://i.ibb.co/9bGN5VD/Unlock-Financial-Freedom-2.png"  />
          <meta name="twitter:title" content="HelloStocker AI App - Best Stocks To Buy Now"/>
          <meta name="twitter:description" content="HelloStocker helps you find stocks before they blow up: test investing strategies with virtual trading, learn how to invest with AI and grow with the stock market today"/>
          <meta name="twitter:image" content="https://i.ibb.co/9bGN5VD/Unlock-Financial-Freedom-2.png"  />
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="apple-touch-icon" href="https://i.ibb.co/9bGN5VD/Unlock-Financial-Freedom-2.png"  />
          {/*<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/143613046.js"></script>*/}
        </Head>
        <Container>
          <Intro />
        {/*  {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}*/}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}

        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'seoExcerpt',
  ])

  return {
    props: { allPosts },
  }
}
