const Brazos_Sheet = [
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2018,
    H_Under6_BothWork: 4751,
    H_Under6_FWork: 4489,
    H_Under6_MWork: 89,
    H_Under6_SingleM: 4991,
    MC18to23: 145.85,
    MC24to29: 145.85,
    MC36to41: 135.15,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2017,
    H_Under6_BothWork: 4739,
    H_Under6_FWork: 4155,
    H_Under6_MWork: 94,
    H_Under6_SingleM: 4919,
    MC18to23: 139.05,
    MC24to29: 139.05,
    MC36to41: 128.45,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2016,
    H_Under6_BothWork: 4901,
    H_Under6_FWork: 4307,
    H_Under6_MWork: 63,
    H_Under6_SingleM: 4507,
    MC18to23: 133.4,
    MC24to29: 133.4,
    MC36to41: 126,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2015,
    H_Under6_BothWork: 5072,
    H_Under6_FWork: 3987,
    H_Under6_MWork: 118,
    H_Under6_SingleM: 4268,
    MC18to23: 126.6,
    MC24to29: 126.6,
    MC36to41: 119.75,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2014,
    H_Under6_BothWork: 4913,
    H_Under6_FWork: 3952,
    H_Under6_MWork: 158,
    H_Under6_SingleM: 4222,
    MC18to23: 120.8,
    MC24to29: 120.8,
    MC36to41: 114.9,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2013,
    H_Under6_BothWork: 4598,
    H_Under6_FWork: 4030,
    H_Under6_MWork: 198,
    H_Under6_SingleM: 4403,
    MC18to23: 129.05,
    MC24to29: 129.05,
    MC36to41: 120.8,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2012,
    H_Under6_BothWork: 4570,
    H_Under6_FWork: 3811,
    H_Under6_MWork: 301,
    H_Under6_SingleM: 4475,
    MC18to23: 120.65,
    MC24to29: 120.65,
    MC36to41: 112,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2011,
    H_Under6_BothWork: 4364,
    H_Under6_FWork: 3699,
    H_Under6_MWork: 328,
    H_Under6_SingleM: 4215,
    MC18to23: 113.4,
    MC24to29: 113.4,
    MC36to41: 105.53,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2010,
    H_Under6_BothWork: 4060,
    H_Under6_FWork: 3663,
    H_Under6_MWork: 279,
    H_Under6_SingleM: 4105,
    MC18to23: 106.15,
    MC24to29: 106.15,
    MC36to41: 99.05,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2009,
    H_Under6_BothWork: 4378,
    H_Under6_FWork: 3943,
    H_Under6_MWork: 275,
    H_Under6_SingleM: 3832,
    MC18to23: 98.9,
    MC24to29: 98.9,
    MC36to41: 92.57,
  },
  {
    State_Name: 'Texas',
    County_Name: 'Brazos County',
    StudyYear: 2008,
    H_Under6_BothWork: 4893,
    H_Under6_FWork: 3672,
    H_Under6_MWork: 321,
    H_Under6_SingleM: 3283,
  },
]
function getChart(data, key, label) {
  const values = data.map((d) => d[key])
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(values)])
    .range([0, 420])
  // Create an empty (detached) chart container.
  const div = d3.create('div')

  // Apply some styles to the chart container.
  div.style('font', '10px sans-serif')
  div.style('text-align', 'right')
  div.style('color', 'white')

  // Define the initial (empty) selection for the bars.
  const bar = div.selectAll('div')

  // Bind this selection to the data (computing enter, update and exit).
  const barUpdate = bar.data(data)

  // Join the selection and the data, appending the entering bars.
  const barNew = barUpdate.join('div')

  // Apply some styles to the bars.
  barNew.style('background', 'steelblue')
  barNew.style('padding', '3px')
  barNew.style('margin', '1px')

  // Set the width as a function of data.
  barNew.style('width', (d) => `${x(d[key])}px`)

  // Set the text of each bar as the data.
  barNew.text((d) => d[key])
  barNew
    .insert('span', ':first-child')
    .text((d) => d[label])
    .style('float', 'left')

  // Return the chart container.
  return div.node()
}
customElements.define(
  'bar-graph',
  class extends HTMLElement {
    constructor() {
      super()
      const chart = getChart(Brazos_Sheet, 'H_Under6_BothWork', 'StudyYear')
      let template = document.createElement('template')
      template.innerHTML = `<style>
          * {
            font-weight: bold;
          }
        </style>${chart.outerHTML}`
      let templateContent = template.content

      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(templateContent.cloneNode(true))
    }
  }
)
