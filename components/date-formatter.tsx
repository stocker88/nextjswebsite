import { parseISO, format } from 'date-fns'

type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString)
  return <div style={{'color':'lightgrey'}}><time dateTime={dateString} style={{'color':'lightgrey'}}>{format(date, 'LLLL	d, yyyy')}</time></div>
}

export default DateFormatter
