import { Routes, Route } from 'react-router-dom'
import NotePicker from './pages/NotePicker'
import Results from './pages/Results'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NotePicker />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}


export default App
