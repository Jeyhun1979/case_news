import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import StoryPage from './pages/StoryPage'
import './App.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename || undefined}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<StoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}
