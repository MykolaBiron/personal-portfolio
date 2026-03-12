import React from 'react';
import { FiFolder, FiExternalLink } from 'react-icons/fi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { 
  SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, 
  SiMongodb, SiAstro, SiVite, SiJavascript, 
  SiFramer 
} from 'react-icons/si';

const projects = [
  {
    id: 'p0a1d9',
    title: 'NutrientAI',
    devStatus: null,
    link: '#',
    timeframe: '2025 — Present',
    company: 'Product Build',
    description: 'An educational platform designed to empower students with easy access to study materials. Students can browse & download PDFs files.',
    icons: [<SiNextdotjs />, <SiTypescript />, <SiTailwindcss />, <SiReact />],
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'React']
  },
  {
    id: 'p3f2b1',
    title: 'Vortexa',
    devStatus: null,
    link: '#',
    timeframe: '2025 — 2026',
    company: 'Product Build',
    description: 'Stay informed about current conditions, forecasts, and astronomical data, and gain valuable insights into current weather patterns and trends.',
    icons: [<SiAstro />, <SiReact />, <SiTypescript />, <SiTailwindcss />],
    tags: ['Astro', 'React', 'TypeScript', 'Tailwind']
  },
  {
    id: 'p8c7e5',
    title: 'Wildlife Image Classifier',
    devStatus: 'Under Development',
    link: '#',
    timeframe: '2026 — Present',
    company: 'Product Build',
    description: 'A real-time chat app, reminiscent of WhatsApp, allowing users to register, login, and connect with friends and family through instant messaging.',
    icons: [<SiVite />, <SiReact />, <SiJavascript />, <SiMongodb />],
    tags: ['Vite', 'React', 'JavaScript', 'MongoDB']
  }
];

export default function ProjectsSection() {
  return (
    <section className="projects timeline" id="projects" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="projects-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <FiFolder style={{ color: '#F05F40', fontSize: '2rem' }} />
        <h2 style={{ fontFamily: 'monospace', fontSize: '2rem', margin: 0, fontWeight: 600, color: '#e5e7eb' }}>
          $ ls -la ~/projects
        </h2>
      </div>

      <div className="timeline-grid projects-timeline-grid">
        <div className="timeline-axis" aria-hidden="true" />
        {projects.map((project, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={project.id} className={`timeline-row ${isLeft ? 'left' : 'right'}`}>
              {isLeft ? (
                <>
                  <article className="timeline-card project-card-ux">
                    <header>
                      <span className="commit-hash">{project.id}</span>
                      <span className="branch-pill">HEAD → project</span>
                      <span className="company-label">{project.company}</span>
                    </header>
                    <div className="timeline-body">
                      <h3>{project.title}</h3>
                      <p className="project-summary">{project.description}</p>
                      <div className="tag-grid">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <footer className="project-footer">
                      <div className="project-stack-icons" aria-label={`${project.title} tech stack`}>
                        {project.icons.map((icon, iconIndex) => (
                          <span key={`${project.id}-icon-${iconIndex}`}>{icon}</span>
                        ))}
                      </div>
                      <div className="project-actions">
                        {project.devStatus && (
                          <span className="project-status-pill">
                            <HiOutlineWrenchScrewdriver size={14} /> {project.devStatus}
                          </span>
                        )}
                        <a href={project.link} className="project-link-inline" aria-label={`Link to ${project.title}`}>
                          <FiExternalLink size={16} />
                        </a>
                      </div>
                    </footer>
                  </article>
                  <div className="timeline-marker"><span className="marker-dot" /></div>
                  <div className="timeline-date-badge">
                    <span>🗂</span> {project.timeframe}
                  </div>
                </>
              ) : (
                <>
                  <div className="timeline-date-badge">
                    <span>🗂</span> {project.timeframe}
                  </div>
                  <div className="timeline-marker"><span className="marker-dot" /></div>
                  <article className="timeline-card project-card-ux">
                    <header>
                      <span className="commit-hash">{project.id}</span>
                      <span className="branch-pill">HEAD → project</span>
                      <span className="company-label">{project.company}</span>
                    </header>
                    <div className="timeline-body">
                      <h3>{project.title}</h3>
                      <p className="project-summary">{project.description}</p>
                      <div className="tag-grid">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <footer className="project-footer">
                      <div className="project-stack-icons" aria-label={`${project.title} tech stack`}>
                        {project.icons.map((icon, iconIndex) => (
                          <span key={`${project.id}-icon-${iconIndex}`}>{icon}</span>
                        ))}
                      </div>
                      <div className="project-actions">
                        {project.devStatus && (
                          <span className="project-status-pill">
                            <HiOutlineWrenchScrewdriver size={14} /> {project.devStatus}
                          </span>
                        )}
                        <a href={project.link} className="project-link-inline" aria-label={`Link to ${project.title}`}>
                          <FiExternalLink size={16} />
                        </a>
                      </div>
                    </footer>
                  </article>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
