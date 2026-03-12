import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { HiOutlineWrenchContent } from 'react-icons/hi2';
import { 
  SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, 
  SiMongodb, SiAstro, SiVitedotjs, SiJavascript, 
  SiFramer 
} from 'react-icons/si';

export default function ProjectContainer() {
    return (
        <div>
            <div className="image-container">
                <img src="https://via.placeholder.com/400x300" alt="Project Mockup" className="project-mockup" />
            </div>
            <div className="pr-name-container">
                <h3>Project Name</h3>
            </div>
            <div>
                <p>Short description of the project goes here. It should be concise and informative, giving an overview of what the project is about.</p>
            </div>
        </div>
    )
}