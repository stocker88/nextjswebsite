import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const PostTitle = ({ children }: Props) => {
  return (
    <center>
    <h1 className="text-3xl md:text-8xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-center" style={{'color':'white'}}>
      {children}
    </h1>
    </center>
  )
}

export default PostTitle
