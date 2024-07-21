import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'
import type Author from '../interfaces/author'

//REMOVED FIREBASE

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
}

const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {

//REMOVED FIREBASE

  return (
    <div>
         <div className="mb-5">
           <CoverImage slug={slug} title={title} src={coverImage} />
         </div>
         <h3 className="text-2xl mb-3 leading-snug excerpt_snug" style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }}>
           <Link
             as={`/posts/${slug}`}
             href="/posts/[slug]"
             className="hover:underline"
           >
             {title}
           </Link>
         </h3>
         <div className="text-lg mb-4" style={{'color':'grey'}}>
           {/*<DateFormatter dateString={date} />*/}
         </div>
         <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey'}}>{excerpt}</p>
        {/* <Avatar name={author.name} picture={author.picture} />*/}
       </div>
  )
}


export default PostPreview
