import Alert from './alert'
import Meta from './meta'
import MeetingButton from '../components/sections/MeetingButton';
import Footer from '../components/layout/Footer';
import { SessionProvider } from '../stockerSession';

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({ preview, children }: Props) => {
  return (
    <>
    <SessionProvider>
    {
      <Meta />
      <div className="min-h-screen">
        {/*<Alert preview={preview} />*/}
        <main>{children}</main>
      </div>
      <MeetingButton style={{  background: "linear-gradient( #1387FF, #3700B3)" }}/>
      <Footer  style={{  background: "linear-gradient(#3700B3, #1387FF)" }}/>
      }
    </SessionProvider>
    </>
  )
}

export default Layout
