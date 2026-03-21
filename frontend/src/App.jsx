import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import Quiz from './pages/Quiz'
import Trace from './pages/Trace'
import Demo from './pages/Demo'
import Docs from './pages/Docs'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/results"     element={<Results />} />
        <Route path="/quiz/:skill" element={<Quiz />} />
        <Route path="/trace/:skill" element={<Trace />} />
        <Route path="/demo"        element={<Demo />} />
        <Route path="/docs"        element={<Docs />} />
      </Routes>
    </BrowserRouter>
  )
}
