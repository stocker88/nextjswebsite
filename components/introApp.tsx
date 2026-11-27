import LocalizedContent from './localization/LocalizedContent';
const IntroApp = () => {
  return (
    <LocalizedContent><section className="signals-heading" aria-labelledby="signals-title">
      <p>Built for better decisions</p>
      <h2 id="signals-title">Get the best stocks before the crowd</h2>
      <span>
        Clear, actionable insights designed to help members identify opportunities,
        understand risk and make more informed investment decisions.
      </span>
    </section></LocalizedContent>
  )
}

export default IntroApp
