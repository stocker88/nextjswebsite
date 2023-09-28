type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} />
      <a href="https://www.linkedin.com/in/anesshusseinali/"><div className="text-xl">{name}</div></a>
    </div>
  )
}

export default Avatar
