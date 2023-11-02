import React from 'react'
import dataSet from './dataSet.json'
import Table from './components/Table'
import Chart from './components/Chart'

function dataToSeries(data) {
  data.sort((a, b) => a.StudyYear - b.StudyYear)
  const series = [
    {
      name: '18 to 23 months old',
      data: [],
    },
    {
      name: '24 to 29 months old',
      data: [],
    },
    {
      name: '36 to 41 months old',
      data: [],
    },
  ]
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (typeof row['MC18to23'] !== 'number') {
      continue
    }
    series[0].data.push(row['MC18to23'])
    series[1].data.push(row['MC24to29'])
    series[2].data.push(row['MC36to41'])
  }
  return series
}

export default function App() {
  return (
    <div>
      <h2>{dataSet.title}</h2>
      <Chart
        id="container"
        description="Basic line chart showing trends in a dataset. This chart includes the series-label module, which adds a label to each line for enhanced readability."
        options={{
          title: {
            text: 'Monthly Cost of Child Care in Brazos County, Texas',
            align: 'left',
          },

          subtitle: {
            text: 'By Year. Source: <a href="https://www.dol.gov/agencies/wb/topics/featured-childcare" target="_blank">Department of Labor</a>.',
            align: 'left',
          },

          yAxis: {
            title: {
              text: 'Cost per Month (USD)',
            },
          },

          xAxis: {
            accessibility: {
              rangeDescription: 'Range: 2008 to 2018',
            },
          },

          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false,
              },
              pointStart: 2008,
            },
          },

          series: dataToSeries(dataSet.data),
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                  },
                },
              },
            ],
          },
        }}
      />
      <Table
        data={dataSet.data}
        sortColumn="StudyYear"
        sortOrder="desc"
      />
    </div>
  )
}
