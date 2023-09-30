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
       <Home/>
        <Head>
          <title>HelloStocker: were ChatGPT Meets Virtual Trading for Financial Success</title>
          <meta charSet="utf-8" />
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" property="og:description" content="Learn budgeting and practise investing with your 24/7 AI Financial Advisor. Don't risk your money: perfect your skills with Virtual Trading. Earn passive income and unlock financial freedom with smart money management, stock investing and crypto trading: we improved ChatGPT for you!" />
          <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#00D9FF" />
          <meta name="description" content="Learn budgeting and practise investing with your 24/7 AI Financial Advisor. Don't risk your money: perfect your skills with Virtual Trading. Earn passive income and unlock financial freedom with smart money management, stock investing and crypto trading: we improved ChatGPT for you!"/>
          <meta property="og:title" content="HelloStocker: AI Financial Advisor and Virtual Trading App" />
          <meta name="og:description" content="Learn budgeting and practise investing with your 24/7 AI Financial Advisor. Don't risk your money: perfect your skills with Virtual Trading. Earn passive income and unlock financial freedom with smart money management, stock investing and crypto trading: we improved ChatGPT for you!" />
          <meta property="og:type" content="video.movie" />
          <meta property="og:url" content="https://www.hellostocker.com/" />
          <meta property="og:image" content="https://i.ibb.co/MNpTyCf/hellostocker-investing-learn-beginners-pro-strategies-trading-stocks-crypto.png"  />
          <meta name="twitter:title" content="HelloStocker: AI Financial Advisor and Virtual Trading App"/>
          <meta name="twitter:description" content="Learn budgeting and practise investing with your 24/7 AI Financial Advisor. Don't risk your money: perfect your skills with Virtual Trading. Earn passive income and unlock financial freedom with smart money management, stock investing and crypto trading: we improved ChatGPT for you!"/>
          <meta name="twitter:image" content="https://i.ibb.co/MNpTyCf/hellostocker-investing-learn-beginners-pro-strategies-trading-stocks-crypto.png"  />
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="apple-touch-icon" href="https://i.ibb.co/MNpTyCf/hellostocker-investing-learn-beginners-pro-strategies-trading-stocks-crypto.png"  />
            <script src="mathjax-config.js" defer></script>
                <script type="text/javascript" id="MathJax-script" defer
                  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
                </script>
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
  ])

  return {
    props: { allPosts },
  }
}
