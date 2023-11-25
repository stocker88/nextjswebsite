import Link from 'next/link'

const Header = () => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-10 mt-8">
      <br></br>
        <center>
      <Link href="/" className="hover:underline" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>
        Back to HelloStocker AI
      </Link>
        </center>

    </h2>
  )
}

export default Header
