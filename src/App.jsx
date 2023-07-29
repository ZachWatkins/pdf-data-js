import React from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './components/MyDocument'
import dataSet from './dataSet.json'
import Table from './components/Table'

export default function App() {

    return (
        <div>
            <h2>{dataSet.title}</h2>
            <Table data={dataSet.data} sortColumn='StudyYear' sortOrder='desc' />
            <PDFViewer width="100%" height="600px">
                <MyDocument data={dataSet.data} />
            </PDFViewer>
        </div>
    )
}
