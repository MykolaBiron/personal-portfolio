import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './App.css'
import profileImg from '../images/photo_2026-03-12_15-16-07.jpg'

import ProjectsSection from './ProjectsSection'
import MobileNav from './MobileNav'
const modules = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Java', 'Spring']

const commandLog = [
  {
    command: 'whoami',
    output:
      'Machine learning engineer focused on modern web tooling and neural systems. Improving neural networks to solve real-world problems.',
  },
  {
    command: 'cat mission.txt',
    output:
      'Translate complex data problems into approachable products. Currently building forecasting pipelines, real-time inference, and ergonomic developer tooling.',
  },
]

const metrics = [
  { label: 'Experience', value: '1+', unit: 'yrs' },
  { label: 'Projects', value: '15+', unit: 'deploys' },
  { label: 'Caffeine', value: '∞', unit: 'ml' },
]

const skills = [
  'Python',
  'Django',
  'Docker',
  'Java',
  'Spring Boot',
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'Git',
  'AWS',
  'React',
  'PostgreSQL',
  'JavaScript',
]

const experience = [
  {
    id: 'a1b2ca2',
    title: 'Student Research Assistant',
    company: 'Hamburg University of Applied Sciences',
    timeframe: '2025-08 — Present',
    summary:
      'Optimization of CNN-LSTM-based network architecture for energy consumption forecasting',
    tags: ['Python', 'TensorFlow', 'Docker', 'Pandas', 'Git', 'AWS', 'Git', 'Jira',],
  },
  {
    id: 'a1b2ca1',
    title: 'Full Stack Developer',
    company: 'Freelance · Upwork / Fiverr',
    timeframe: '2022-06 — 2024-05',
    summary: 'Developed and maintained web applications for international clients across finance and education.',
    tags: ['JavaScript', 'Express', 'PostgreSQL', 'React'],
  },
]

function App() {
  

  return (
    <main className="scene">
      <div className="grid-overlay" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <section className="hero" id="hero">
        <div className="hero-copy">
          <span className="status-pill">system.kernel :: v2.5.0 online</span>
          <p className="eyebrow">Architect</p>
          <h1>
            Hello, I&apos;m <span className="gradient-text">Mykola Biron</span>
          </h1>
          <p className="hero-description">
            Engineering beyond boundaries. I specialize in neural networks,
            timeseries forecasting, and transformers architectures
          </p>

          <div className="cta-row">
            <a href="#projects" className="primary">View Projects</a>
            <a href="https://github.com/MykolaBiron" target="_blank" rel="noopener noreferrer" className="ghost">Visit GitHub</a>
          </div>

          <div className="modules desktop-modules">
            <span>Loaded Modules:</span>
            <ul>
              {modules.map((module) => (
                <li key={module}>{module}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero-visuals">
          <article className="code-window">
            <header>
              <span />
              <span />
              <span />
              <p>portfolio.tsx</p>
              <button aria-label="Open code" />
            </header>
            <pre className="code-body">
              <code>
                <span className="code-line">
                  <span className="token comment">// Welcome to my workspace</span>
                </span>
                <span className="code-line">
                  <span className="token keyword">import</span>{' '}
                  <span className="token punctuation">{'{'}</span>{' '}
                  <span className="token identifier">Developer</span>{' '}
                  <span className="token punctuation">{'}'}</span>{' '}
                  <span className="token keyword">from</span>{' '}
                  <span className="token string">'./universe'</span>
                  <span className="token punctuation">;</span>
                </span>
                <span className="code-line" aria-hidden="true">
                  <span>&nbsp;</span>
                </span>
                <span className="code-line">
                  <span className="token keyword">const</span>{' '}
                  <span className="token function">Portfolio</span>{' '}
                  <span className="token operator">=</span>{' '}
                  <span className="token punctuation">()</span>{' '}
                  <span className="token operator">=&gt;</span>{' '}
                  <span className="token punctuation">{'{'}</span>
                </span>
                <span className="code-line indent-1">
                  <span className="token keyword">return</span>{' '}
                  <span className="token punctuation">(</span>
                </span>
                <span className="code-line indent-2">
                  <span className="token punctuation">{'<'}</span>
                  <span className="token component">Developer</span>
                </span>
                <span className="code-line indent-3">
                  <span className="token attr">name</span>
                  <span className="token operator">=</span>
                  <span className="token string">"Mykola Biron"</span>
                </span>
                <span className="code-line indent-3">
                  <span className="token attr">role</span>
                  <span className="token operator">=</span>
                  <span className="token string">"Machine Learning Engineer"</span>
                </span>
                <span className="code-line indent-3">
                  <span className="token attr">passion</span>
                  <span className="token operator">=</span>
                  <span className="token string">"Engineering Beyond Boundaries"</span>
                </span>
                <span className="code-line indent-2">
                  <span className="token punctuation">{'/>'}</span>
                </span>
                <span className="code-line indent-1">
                  <span className="token punctuation">)</span>
                  <span className="token punctuation">;</span>
                </span>
                <span className="code-line">
                  <span className="token punctuation">{'}'}</span>
                  <span className="token punctuation">;</span>
                </span>
                <span className="code-line" aria-hidden="true">
                  <span>&nbsp;</span>
                </span>
                <span className="code-line">
                  <span className="token keyword">export</span>{' '}
                  <span className="token keyword">default</span>{' '}
                  <span className="token function">Portfolio</span>
                  <span className="token punctuation">;</span>
                </span>
              </code>
            </pre>
          </article>

          <article className="terminal-card">
            <div className="terminal-header">
              <span>Initialize OS</span>
              <a href="#" aria-label="Open in new window" />
            </div>
            <p>&gt; sudo boot_gui</p>
            <div className="progress">
              <span />
            </div>
            <small>Loading...</small>
          </article>
        </div>

        <div className="modules mobile-modules">
          <span>Loaded Modules:</span>
          <ul>
            {modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about" id="about">
        <div className="section-header">
          <span className="prompt">&gt;_</span>
          <h2># About.system</h2>
        </div>

        <div className="about-grid">
          <article className="operator-card">
            <div className="avatar-stack">
              <div className="avatar-ring">
                <img
                  src={profileImg}
                  alt="Portrait of Mykola Biron"
                />
              </div>
              <span className="status-led" aria-label="Currently available" />
            </div>

            <ul className="operator-fields">
              <li>
                <span className="label">Operator</span>
                <span className="value accent">Mykola Biron</span>
              </li>
              <li>
                <span className="label">Role</span>
                <span className="value">MACHINE_LEARNING_ENGINEER</span>
              </li>
              <li>
                <span className="label">Location</span>
                <span className="value">Hamburg, Germany</span>
              </li>
              <li>
                <span className="label">Status</span>
                <span className="status-pill online">OPEN</span>
              </li>
            </ul>
          </article>

          <article className="user-log">
            <header>
              <span className="log-name">user_profile.log</span>
              <button aria-label="Expand log" />
            </header>
            {commandLog.map((entry) => (
              <div key={entry.command} className="command-block">
                <p className="command">
                  <span>↳</span> {entry.command}
                </p>
                <p className="command-output">{entry.output}</p>
              </div>
            ))}
          </article>
        </div>

        <div className="about-metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <p className="metric-label">{metric.label}</p>
              <p className="metric-value">
                {metric.value}
                <span>{metric.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="timeline" id="experience">
        <div className="section-header">
          <span className="prompt">⌘</span>
          <h2>$ git log --stat --online</h2>
        </div>
        <div className="timeline-grid">
          <div className="timeline-axis" aria-hidden="true" />
          {experience.map((entry, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={entry.id} className={`timeline-row ${isLeft ? 'left' : 'right'}`}>
                {isLeft ? (
                  <>
                    <article className="timeline-card">
                      <header>
                        <span className="commit-hash">{entry.id}</span>
                        <span className="branch-pill">HEAD → {index === 0 ? 'engineer' : 'developer'}</span>
                        <span className="company-label">{entry.company}</span>
                      </header>
                      <div className="timeline-body">
                        <h3>{entry.title}</h3>
                        <p>{entry.summary}</p>
                        <div className="tag-grid">
                          {entry.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    
                    </article>
                    <div className="timeline-marker" />
                    <div className="timeline-date-badge">
                      <span>🗓</span> {entry.timeframe}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="timeline-date-badge">
                      <span>🗓</span> {entry.timeframe}
                    </div>
                    <div className="timeline-marker" />
                    <article className="timeline-card">
                      <header>
                        <span className="commit-hash">{entry.id}</span>
                        <span className="branch-pill">HEAD → {index === 0 ? 'engineer' : 'developer'}</span>
                        <span className="company-label">{entry.company}</span>
                      </header>
                      <div className="timeline-body">
                        <h3>{entry.title}</h3>
                        <p>{entry.summary}</p>
                        <div className="tag-grid">
                          {entry.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <footer>
                        
                      </footer>
                    </article>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ProjectsSection />

      <article id="contact" className="code-window contact-window" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '4rem', marginBottom: '4rem' }}>
        <header>
          <span />
          <span />
          <span />
          <p>&lt;/&gt; contact_info.json</p>
          <div style={{ flex: 1 }} />
        </header>
        <pre className="code-body">
          <code style={{ display: 'block', padding: '1rem 0' }}>
            {[
              { num: 1, text: <span style={{ color: '#e5b567' }}>{'{'}</span>, indent: 0 },
              { num: 2, text: <><span style={{ color: '#e87d3e' }}>"status"</span><span style={{ color: '#d4d4d4' }}>: </span><span style={{ color: '#9ece6a' }}>"open_to_work"</span><span style={{ color: '#d4d4d4' }}>,</span></>, indent: 1 },
              { num: 3, text: <><span style={{ color: '#e87d3e' }}>"email"</span><span style={{ color: '#d4d4d4' }}>: </span><span style={{ color: '#e87d3e' }}>"mykolabiron@gmail.com"</span><span style={{ color: '#d4d4d4' }}>,</span></>, indent: 1 },
              { num: 4, text: <><span style={{ color: '#e87d3e' }}>"socials"</span><span style={{ color: '#d4d4d4' }}>: </span><span style={{ color: '#e5b567' }}>{'{'}</span></>, indent: 1 },
              { num: 5, text: <><span style={{ color: '#e87d3e' }}>"github"</span><span style={{ color: '#d4d4d4' }}>: </span>
              <span style={{ color: '#e87d3e' }}><a href="https://github.com/MykolaBiron" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>"@MykolaBiron"</a></span><span style={{ color: '#d4d4d4' }}>,</span></>, indent: 2 },
              { num: 6, text: <><span style={{ color: '#e87d3e' }}>"linkedin"</span><span style={{ color: '#d4d4d4' }}>: </span><span style={{ color: '#e87d3e' }}>
                <a href="https://www.linkedin.com/in/mykola-biron-a4aa972a6/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>"@MykolaBiron"</a>
                </span><span style={{ color: '#d4d4d4' }}>,</span></>, indent: 2 },
              { num: 7, text: <><span style={{ color: '#e87d3e' }}>"twitter"</span><span style={{ color: '#d4d4d4' }}>: </span><span style={{ color: '#e87d3e' }}><a href="https://twitter.com/abdulmomin7863" style={{ color: 'inherit', textDecoration: 'none' }}>"@MykolaBiron"</a></span></>, indent: 2 },
              { num: 8, text: <><span style={{ color: '#e5b567' }}>{'}'}</span><span style={{ color: '#d4d4d4' }}>,</span></>, indent: 1 },
              { num: 9, text: <><span style={{ color: '#e87d3e' }}>"location"</span><span style={{ color: '#d4d4d4' }}>: </span><span style={{ color: '#e87d3e' }}>"Hamburg, Germany"</span></>, indent: 1 },
              { num: 10, text: <span style={{ color: '#e5b567' }}>{'}'}</span>, indent: 0 },
              { num: 11, text: '', indent: 0 },
              { num: 12, text: <span style={{ color: '#6a9955', fontStyle: 'italic' }}>// Waiting for connection...</span>, indent: 0 },
              { num: '-', text: <span className="cursor-blink" style={{ color: '#e87d3e', fontWeight: 'bold' }}>_</span>, indent: 0 }
            ].map((line, i) => (
              <div key={i} className="json-line">
                <span className="line-num">{line.num}</span>
                <span className="line-content" style={{ paddingLeft: `${line.indent * 1.5}rem` }}>
                  {line.text}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </article>
      <MobileNav />
      <footer className="site-footer">
        <div>
        <p className="footer-name">Mykola Biron</p>
          <p>&copy; Mykola Biron {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

export default App