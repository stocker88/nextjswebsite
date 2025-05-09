import { CMS_NAME } from '../lib/constants'

const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 md:mb-12">
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }}>
        Learn From Millionnaires
      </h2>
      <br></br>
      {/*
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        A statically generated blog example using{' '}
        <a
          href="https://nextjs.org/"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
          Next.js
        </a>{' '}
        and {CMS_NAME}.
      </h4>*/}
    </section>
  )
}

export default Intro
