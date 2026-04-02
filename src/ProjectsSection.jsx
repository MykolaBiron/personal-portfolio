import React from 'react';
import { FiFolder, FiExternalLink, FiCode } from 'react-icons/fi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { 
  SiAstro,
  SiDjango,
  SiDocker,
  SiJavascript,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiStreamlit,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
} from 'react-icons/si';

const tagIcons = {
  Python: <SiPython />,
  Django: <SiDjango />,
  Tensorflow: <SiTensorflow />,
  PostgreSQL: <SiPostgresql />,
  Postgresql: <SiPostgresql />,
  JavaScript: <SiJavascript />,
  Docker: <SiDocker />,
  Astro: <SiAstro />,
  React: <SiReact />,
  TypeScript: <SiTypescript />,
  Tailwind: <SiTailwindcss />,
  PyTorch: <SiPytorch />,
  OpenCV: <SiOpencv />,
  Streamlit: <SiStreamlit />,
};

const projects = [
  {
    id: 'p0a1d9',
    title: 'FoodAdvisorAI',
    devStatus: null,
    websiteUrl: 'https://food-advisor-production-3924.up.railway.app/',
    githubUrl: 'https://github.com/MykolaBiron/Food-Advisor',
    timeframe: '2025 — Present',
    company: 'Product Build',
    description: 'An AI-powered nutrition tracking application that uses deep learning to identify food from images and automatically track nutritional intake.',
    tags: ['Python', 'Django', 'Tensorflow', 'Postgresql', 'JavaScript', 'Docker']
  },
  {
    id: 'p3f2b1',
    title: 'Football Live Predictor',
    devStatus: null,
    websiteUrl: '#',
    githubUrl: 'https://github.com/MykolaBiron/soccer-live-predictor',
    timeframe: '2025 — 2026',
    company: 'Product Build',
    description: 'A full-stack SpringBoot + React application for real-time footbal matches tracking.',
    tags: ['SpringBoot', 'React', 'TypeScript', 'PostgreSQL']
  },
  {
    id: 'p8c7e5',
    title: 'Wildlife Image Classifier',
    devStatus: 'Under Development',
    websiteUrl: '#',
    githubUrl: 'https://github.com/MykolaBiron/WildFrame',
    timeframe: '2026 — Present',
    company: 'Product Build',
    description: 'Computer Vision app that automates wildlife photography by extracting high-fidelity stills from 4K video',
    tags: ['Python', 'PyTorch', 'OpenCV', 'Docker', "Streamlit"]
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
                        {project.tags.map((tag, iconIndex) => (
                          <span key={`${project.id}-icon-${iconIndex}`} title={tag} aria-label={tag}>
                            {tagIcons[tag] ?? <FiCode />}
                          </span>
                        ))}
                      </div>
                      <div className="project-actions">
                        {project.devStatus && (
                          <span className="project-status-pill">
                            <HiOutlineWrenchScrewdriver size={14} /> {project.devStatus}
                          </span>
                        )}
                        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn" aria-label={`Visit ${project.title} website`}>
                          Visit
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn project-action-btn--ghost" aria-label={`View ${project.title} on GitHub`}>
                          <FiExternalLink size={14} /> View on GitHub
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
                        {project.tags.map((tag, iconIndex) => (
                          <span key={`${project.id}-icon-${iconIndex}`} title={tag} aria-label={tag}>
                            {tagIcons[tag] ?? <FiCode />}
                          </span>
                        ))}
                      </div>
                      <div className="project-actions">
                        {project.devStatus && (
                          <span className="project-status-pill">
                            <HiOutlineWrenchScrewdriver size={14} /> {project.devStatus}
                          </span>
                        )}
                        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn" aria-label={`Visit ${project.title} website`}>
                          Visit
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-action-btn project-action-btn--ghost" aria-label={`View ${project.title} on GitHub`}>
                          <FiExternalLink size={14} /> View on GitHub
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
