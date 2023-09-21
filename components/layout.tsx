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
      <MeetingButton style={{  background: "linear-gradient( #1387FF, #1387FF)" }}/>
        <Footer  style={{  background: "linear-gradient(#1387FF, #00D9FF)" }}/>
    </>
  )
}

export default Layout
