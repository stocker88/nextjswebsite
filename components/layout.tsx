import Alert from './alert'
import Meta from './meta'
import MeetingButton from '../components/sections/MeetingButton';
import Footer from '../components/layout/Footer';

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({ preview, children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        {/*<Alert preview={preview} />*/}
        <main>{children}</main>
      </div>
      <section style={{
                                   borderBottom: '0.3px solid #333', // Adjust the color and style as needed
                                      paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                                      marginBottom: '10px', // Adjust the margin to give some space between sections
                                      width: '90%', // Take up 90% of the screen width
                                      maxWidth: '1000px', // Set a maximum width of 1000 pixels
                                      margin: '0 auto', // Center the sections horizontally
                                   }}/>
                                   <br/><br/>
      <MeetingButton />
      <Footer />
    </>
  )
}

export default Layout