import React, { useState } from 'react'

export default function Tooltip({ text }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span className="tooltip-icon" tabIndex={0} aria-label="More info">?</span>
      {visible && <span className="tooltip-bubble" role="tooltip">{text}</span>}
    </span>
  )
}
