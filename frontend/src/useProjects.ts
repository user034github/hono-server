import { useState, useEffect } from 'react';

interface Project {
	id: number;
	tittel: string;
	beskrivelse: string;
	publishedAt: string;
	status: 'draft' | 'published';
	tags: string;
}

const useProjects = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
    		const fetchProjects = async () => {
      			try {
        			setLoading(true);
        			const response = await fetch('http://localhost:3000/prosjekter');
        			const data = await response.json();
        			if (Array.isArray(data)) {
          				setProjects(data);
        			} else {
          				setProjects([]);
        			}
      		} catch (err) {
        		console.error('Kunne ikke laste inn prosjekter', err);
        		setError('Kunne ikke laste inn prosjekter');
      		} finally {
        		setLoading(false);
      		}
    	};
    	fetchProjects();
  }, []);
	return { projects, loading, error, setProjects };
};

export default useProjects;