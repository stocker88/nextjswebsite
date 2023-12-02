import markdownStyles from './markdown-styles.module.css'
import Markdown from 'react-markdown'
import Zoom from 'react-medium-image-zoom'
import Image from 'next/image'

type Props = {
  content: string
}

const CustomP = ({ children }) => (
  <h2 className="text-xl">{children}</h2>
);

const CustomH2 = ({ children }) => (
  <h2 className="text-6xl font-bold">{children}</h2>
);

const CustomH3 = ({ children }) => (
  <h3 className="text-5xl">{children}</h3>
);

const CustomH4 = ({ children }) => (
  <h4 className="text-2xl font-bold">{children}</h4>
);

const CustomH5 = ({ children }) => (
  <h5 className="text-base font-bold">{children}</h5>
);

const CustomH6 = ({ children }) => (
  <h6 className="text-sm font-bold">{children}</h6>
);


const CustomLink = ({ href, children }) => (
  <a
    href={href}
    className="text-blue-500 hover:underline hover:text-blue-600"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const CustomImage = ({ alt, src, title }) => (
  <div className="my-4">
    <Zoom><Image
      className="max-w-full rounded-lg"
      src={src}
      alt={alt}
      height={500}
      width={1000}
      title={title}
    /></Zoom>
    {title && <p className="text-center text-sm mt-2 text-gray-600">{title}</p>}
  </div>
);

const PostBody = ({ content }: Props) => {
  return (
    <div className="max-w-2xl mx-auto" style={{'color':'lightgrey'}}>
      <Markdown
      components={{
          a: CustomLink,
          img: CustomImage,
           p: CustomP,
           h2: CustomH2,
              h3: CustomH3,
              h4: CustomH4,
              h5: CustomH5,
              h6: CustomH6,
        }}
        >{content}</Markdown>

      <br></br>
      <br></br>
      <br></br>
    </div>
  )
}

export default PostBody
