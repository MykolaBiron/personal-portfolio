import { useState, useEffect } from 'react'
import { FiCode, FiUser, FiBriefcase, FiFolder, FiMail } from 'react-icons/fi'

const links = [
  { href: '#hero',       Icon: FiCode,      label: 'Home'       },
  { href: '#about',      Icon: FiUser,      label: 'About'      },
  { href: '#experience', Icon: FiBriefcase, label: 'Experience' },
  { href: '#projects',   Icon: FiFolder,    label: 'Projects'   },
  { href: '#contact',    Icon: FiMail,      label: 'Contact'    },
]

export default function MobileNav() {
  const [active, setActive] = useState('hero')

  // Track which section is in view via IntersectionObserver
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {links.map(({ href, Icon, label }) => {
        const id = href.slice(1)
        return (
          <a
            key={href}
            href={href}
            className={`mobile-nav-item${active === id ? ' mobile-nav-item--active' : ''}`}
            aria-label={label}
            onClick={() => setActive(id)}
          >
            <Icon size={22} />
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}
