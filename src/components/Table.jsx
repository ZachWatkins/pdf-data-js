import React from 'react'

export default function Table({ data, sortColumn, sortOrder }) {

    const keys = React.useRef(Object.keys(data[0]))
    const [sortByColumn, setSortByColumn] = React.useState(sortColumn || keys.current[0])
    const [sortByOrder, setSortByOrder] = React.useState(sortOrder || 'asc')
    const sortedData = React.useMemo(() => {
        return data.concat().sort((a, b) => {
            if (typeof a[sortByColumn] === 'number') {
                if (sortByOrder === 'asc') return a[sortByColumn] - b[sortByColumn]
                return b[sortByColumn] - a[sortByColumn]
            }
            return a[sortByColumn].localeCompare(b[sortByColumn])
        })
    }, [sortByColumn, sortByOrder])

    function handleSort (column) {
        if (sortByColumn === column) {
            setSortByOrder(sortByOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setsortByColumn(column)
            setSortByOrder('asc')
        }
    }

    return (
        <table>
            <thead>
                <tr>
                    {keys.current.map((item, index) => (
                        <th style={{cursor:"pointer"}} key={index} onClick={() => handleSort(item)}>
                            {item}
                            {sortByColumn === item && (
                                <span>{sortByOrder === 'asc' ? '▼' : '▲'}</span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((item, index) => (
                    <tr key={index}>
                        {keys.current.map((key, index) => (
                            <td key={index}>{item[key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
