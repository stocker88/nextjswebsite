import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'


type Props = {
  title: string
  src: string
  slug?: string
}

function CoverImageTracked ({ title, src, slug }: Props) {
//REMOVED FIREBASE

  const image = (
  <center>
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1300}
      height={630}
      style={{'maxWidth':'1000px','borderRadius': '10px 10px 10px 10px'}}
      unoptimized={true}
    />
    </center>
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title} >
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
};

export default CoverImageTracked;
