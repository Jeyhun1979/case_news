import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        Hacker News
      </Link>
      <nav className="header__nav">
        <Link to="/">Новости</Link>
      </nav>
    </header>
  )
}
