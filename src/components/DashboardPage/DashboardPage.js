import React from 'react'
import MapEvents from '../EventsMap/EventsMap'
import { requestData } from '../../config/Data'

const DashboardPage = () => {
  return (
    <div>
      <h2 className='' style={{textAlign: 'center'}}>Welcome To the Dashboard, Click the Marker To show the Details</h2>
      <MapEvents locations={requestData}/>
    </div>
  )
}

export default DashboardPage