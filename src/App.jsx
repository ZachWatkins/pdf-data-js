import React from 'react'
import dataSet from './dataSet.json'
import Table from './components/Table'

export default function App() {

    return (
        <div>
            <h2>{dataSet.title}</h2>
            <Table data={dataSet.data} sortColumn='StudyYear' sortOrder='desc' />
        </div>
    )
}
