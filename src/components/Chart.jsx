import * as Highcharts from 'highcharts'
import '../css/Chart.css'
import React from 'react'

export function Chart({ id, description, options }) {
  React.useEffect(() => {
    Highcharts.chart(id, options)
  }, [])

  return (
    <figure className="highcharts-figure">
      <div id={id}></div>
      <p className="highcharts-description">{description}</p>
    </figure>
  )
}

export default Chart
