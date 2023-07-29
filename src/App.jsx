import React from 'react'
import dataSet from './dataSet.json'

export default function App() {

    const [sortColumn, setSortColumn] = React.useState('StudyYear')
    const [sortOrder, setSortOrder] = React.useState('asc')

    const keys = Object.keys(dataSet.data[0])

    const sortByNumberOrString = (a, b) => {
        if (typeof a[sortColumn] === 'number') {
            if (sortOrder === 'asc') return a[sortColumn] - b[sortColumn]
            return b[sortColumn] - a[sortColumn]
        }
        return a[sortColumn].localeCompare(b[sortColumn])
    }
    console.log(sortColumn, sortOrder)

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortOrder('asc')
        }
    }

    return (
        <div>
            <h2>{dataSet.title}</h2>
            <table>
                <thead>
                    <tr>
                        {keys.map((item, index) => (
                            <th style={{cursor:"pointer"}} key={index} onClick={() => handleSort(item)}>
                                {item}
                                {sortColumn === item && (
                                    <span>{sortOrder === 'asc' ? '▼' : '▲'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataSet.data.concat().sort(sortByNumberOrString).map((item, index) => (
                        <tr key={index}>
                            {keys.map((key, index) => (
                                <td key={index}>{item[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
