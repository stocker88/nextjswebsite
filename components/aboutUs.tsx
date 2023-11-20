import { CMS_NAME } from '../lib/constants'

const AboutUs = () => {
  return (

    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }} >
        We Want You To Be Successful
      </h2>
     {/* <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        You have control over your own success

      </h4>*/}
    </section>

  )
}

export default AboutUs
