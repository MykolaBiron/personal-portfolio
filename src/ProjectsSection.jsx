import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { HiOutlineWrenchContent } from 'react-icons/hi2';
import { 
  SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, 
  SiMongodb, SiAstro, SiVitedotjs, SiJavascript, 
  SiFramer 
} from 'react-icons/si';

const projects = [
  {
    title: 'ARMS v3',
    devStatus: null,
    link: '#',
    description: 'An educational platform designed to empower students with easy access to study materials. Students can browse & download PDFs files.',
    icons: [<SiNextdotjs />, <SiTypescript />, <SiTailwindcss />, <SiReact />],
    // Deep purple top
    mockTop: 'linear-gradient(135deg, #44569e 0%, #302660 100%)',
    baseColor: '#2b0c51'
  },
  {
    title: 'Vortexa',
    devStatus: null,
    link: '#',
    description: 'Stay informed about current conditions, forecasts, and astronomical data, and gain valuable insights into current weather patterns and trends.',
    icons: [<SiAstro />, <SiReact />, <SiTypescript />, <SiTailwindcss />],
    // Blue / cyan top
    mockTop: 'linear-gradient(135deg, #10668a 0%, #143555 100%)',
    baseColor: '#120531',
    hoverView: true
  },
  {
    title: 'XRecon',
    devStatus: 'Under Development',
    link: '#',
    description: 'A real-time chat app, reminiscent of WhatsApp, allowing users to register, login, and connect with friends and family through instant messaging.',
    icons: [<SiVitedotjs />, <SiReact />, <SiJavascript />, <SiMongodb />],
    // Purple / dark top
    mockTop: 'linear-gradient(135deg, #322659 0%, #1c1538 100%)',
    baseColor: '#1a0438'
  }
];

export default function ProjectsSection() {
  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <h2>My Projects <span className="highlight">&gt;</span></h2>
        <div className="line"></div>
      </div>
      
      <div className="projects-grid">
        {projects.map((p, idx) => (
          <article 
            key={idx} 
            className="project-card"
            style={{ '--base-bg': p.baseColor }}
          >
            {p.hoverView && (
              <div className="project-view-cursor">View</div>
            )}
            
            <div className="project-img-wrapper" style={{ background: p.mockTop }}>
              <div className="mock-img"></div>
              {/* Swoosh shape matching the design */}
              <div className="project-swoosh" style={{ color: p.baseColor }}>
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,256L80,224C160,192,320,128,480,122.7C640,117,800,171,960,181.3C1120,192,1280,149,1360,128L1440,107L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
              </div>
            </div>
            
            <div className="project-content" style={{ background: p.baseColor }}>
              <div className="project-title-row">
                <h3>{p.title}</h3>
                {p.devStatus ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span className="under-dev-badge">
                      <HiOutlineWrenchContent size={16} /> {p.devStatus}
                    </span>
                    <a href={p.link} className="project-link-btn" aria-label={`Link to ${p.title}`}>
                      <FiExternalLink size={20} />
                    </a>
                  </div>
                ) : (
                  <a href={p.link} className="project-link-btn" aria-label={`Link to ${p.title}`}>
                    <FiExternalLink size={20} />
                  </a>
                )}
              </div>
              
              <p className="project-desc">{p.description}</p>
              
              <div className="project-tech-row">
                {p.icons.map((icon, i) => (
                  <span key={i} style={{ color: '#fff', opacity: 0.8 }}>
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
