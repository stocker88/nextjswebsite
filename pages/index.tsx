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
          <title>HelloStocker: AI Financial Advisor App</title>
          <meta charSet="utf-8" />
          <meta name="description" property="og:description" content="Stocker AI App is an Investing Advisory App that helps you design strategies and practise them with virtual trading! Learn how to make money and earn passive income with Stocker Ai App" />
          <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#00D9FF" />
          <meta name="description" property="og:description" content="Stocker AI App is an Investing Advisory App that helps you design strategies and practise them with virtual trading! Learn how to make money and earn passive income with Stocker Ai App" />
          <meta name="description" content="Stocker AI App is an Investing Advisory App that helps you design strategies and practise them with virtual trading! Learn how to make money and earn passive income with Stocker Ai App" />
          <meta property="og:title" content="Design Strategies with your AI Financial Advisor and Practise Virtual Investing: Make Money and Take Control Over your Own Success" />
          <meta name="og:description" content="Make Money with your Investing Advisor available 24/7! A financial bot and improved version of ChatGPT! Start building your passive income and make money online! Build your brand in Stocker App with all the money you need! powered by ChatGPT bot advise - Start building your passive income and make money online!  Join a community of live and transparent investors and find the best trades with free financial analytics, Speak with your ChatGPT bot advisor! Find the best stocks and cryptocurrency" />
          <meta property="og:type" content="video.movie" />
          <meta property="og:url" content="https://www.hellostocker.com/" />
          <meta property="og:image" content="https://i.ibb.co/3TmgmYC/hellostocker-stocker-app-ai-financial-advisor-budgeting-investing.png"  />
          <meta name="twitter:title" content="Design Strategies with your AI Financial Advisor and Practise Virtual Investing: Make Money and Take Control Over your Own Success"/>
          <meta name="twitter:description" content="Stocker AI App is an Investing Advisory App that helps you design strategies and practise them with virtual trading! Learn how to make money and earn passive income with Stocker Ai App" />
          <meta name="twitter:image" content="https://i.ibb.co/3TmgmYC/hellostocker-stocker-app-ai-financial-advisor-budgeting-investing.png"  />
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="apple-touch-icon" href="https://i.ibb.co/3TmgmYC/hellostocker-stocker-app-ai-financial-advisor-budgeting-investing.png"  />
          <title>HelloStocker App is an Investing Advisory AI driven App that helps you design strategies and practise them with virtual trading! Learn how to make money and earn passive income with Stocker Ai App</title>
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
