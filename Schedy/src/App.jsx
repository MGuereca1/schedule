import { useState } from 'react'
import './fanta.css'
import Layout from './components/Layout'
import Hero from './components/Hero'
import Tabs from './components/Tabs'
import Calendar from './components/Calendar'

function App() {

  return (
    <Layout>
      <Hero/>
      <Tabs></Tabs>
      <Calendar></Calendar>
    </Layout>

  )
}

export default App
