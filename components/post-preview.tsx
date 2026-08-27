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
    <article className="article-card">
         <div className="article-card__image">
           <CoverImage slug={slug} title={title} src={coverImage} />
         </div>
         <div className="article-card__body">
         <h3 className="article-card__title">
           <Link
             as={`/posts/${slug}`}
             href="/posts/[slug]"
             className="article-card__title-link"
           >
             {title}
           </Link>
         </h3>
         <p className="article-card__excerpt">{excerpt}</p>
         <Link as={`/posts/${slug}`} href="/posts/[slug]" className="article-card__read-more">
           Read article <span aria-hidden="true">→</span>
         </Link>
         </div>
       </article>
  )
}


export default PostPreview
