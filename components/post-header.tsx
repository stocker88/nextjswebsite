import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import PostTitle from './post-title'
import type Author from '../interfaces/author'

type Props = {
  title: string
  coverImage: string
  date: string
  author: Author
}

const PostHeader = ({ title, coverImage, date, author }: Props) => {
  return (
    <header className="article-header">
      <span className="article-header__eyebrow">INVESTING INSIGHT</span>
      <PostTitle>{title}</PostTitle>
      <div className="post-detail-cover">
        <CoverImage title={title} src={coverImage} />
      </div>
      <div className="article-byline">
        <div className="article-author">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="article-date">
          <DateFormatter dateString={date}/>
        </div>
      </div>
    </header>
  )
}

export default PostHeader
