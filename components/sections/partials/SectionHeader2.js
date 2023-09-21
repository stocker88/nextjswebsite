import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    paragraph: PropTypes.string
  }).isRequired,
  children: PropTypes.node,
  tag: PropTypes.oneOf(['h1'])
}

const defaultProps = {
  children: null,
  tag: 'h2'
}

const SectionHeader2 = ({
  className,
  data,
  children,
  tag,
  ...props
}) => {

  const classes = classNames(
    className
  );

  const Component = tag;

  return (
    <>
      {(data.title || data.paragraph) &&
        <div
          {...props}
          className={classes}
        >
          <div className="container" >
          <div className="reveal-from-bottom" data-reveal-delay="200">
            {
              <p style={{ color: 'white',fontSize: "min(32px,max(25px,2.5vw))",  fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)'  }}>{data.title}</p>
            }
          </div>
          </div>
        </div>
      }
    </>
  );
}

SectionHeader2.propTypes = propTypes;
SectionHeader2.defaultProps = defaultProps;

export default SectionHeader2;