import Link from 'next/link'

//REMOVED FIREBASE
type Props = {
  slug: string
}

const Header = ({ slug }: Props) => {

  return (
    <h2 className="text-xl md:text-3xl font-bold tracking-tight md:tracking-tighter leading-tight mb-10 mt-8">
      <br></br>
        <center>
      <Link
      href="/"
      className="hover:underline"
      style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }}
      >
        StocksToBuyNow.AI
      </Link>
        </center>

    </h2>
  )
}

export default Header
