import cn from 'classnames'

import useUiContext from '../../BlockEditor/Contexts/UiContext'

function Heading({ headingLevel, className, ...props }) {
  const { externalStyles } = useUiContext()
  const Component = `h${headingLevel}` as any
  return (
    <Component
      {...props}
      className={cn(
        className,
        externalStyles.heading,
        externalStyles[`heading${headingLevel}`]
      )}
    />
  )
}

const getHeadingComponent = (headingLevel) => (props) =>
  <Heading headingLevel={headingLevel} {...props} />
export default getHeadingComponent
