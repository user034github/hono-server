import React, { useState } from 'react';
import OversiktComponent from './OversiktComponent';
import ProsjektformComponent from './ProsjektformComponent';
import ProsjektKomponent from './ProsjektKomponent';
import useProjects from './useProjects';
import endpoints from './config';
import { z } from 'zod';
import {ProjectSchema, Project } from './ProjectSchema';

const ProjectPage: React.FC = () => {
    const { projects, loading, error, setProjects } = useProjects();
    const [tittel, setTittel] = useState('');
    const [beskrivelse, setBeskrivelse] = useState('');
    const [publishedAt, setPublishedAt] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [tags, setTags] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const addProject = async (
        tittel: string,
        beskrivelse: string,
        publishedAt: string,
        status: 'draft' | 'published',
        tags: string
    ) => {
        try {
            const response = await fetch(endpoints.projects, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tittel, beskrivelse, publishedAt, status, tags }),
            });

            if (response.ok) {
                const newProject = await response.json();
                setProjects((prevProjects) => [...prevProjects, newProject]);
                setValidationErrors([]);
            } else {
                throw new Error('Kunne ikke legge til prosjektet');
            }
        } catch (err) {
            console.error('Kunne ikke legge til prosjektet', err);
        }
    };

    const deleteProject = async (id: number) => {
        try {
            const response = await fetch(endpoints.deleteProject(id), {
                method: 'DELETE',
            });

            if (response.ok) {
                setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));
            } else {
                throw new Error('Kunne ikke slette prosjektet');
            }
        } catch (err) {
            console.error('Kunne ikke slette prosjektet', err);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidationErrors([]);

	const formData = {
		tittel,
		beskrivelse,
		publishedAt,
		status,
		tags
	};

	try {
            const validatedData = ProjectSchema.parse(formData);
            await addProject(validatedData.tittel, validatedData.beskrivelse, validatedData.publishedAt, validatedData.status, validatedData.tags);

	    setTittel('');
            setBeskrivelse('');
            setPublishedAt('');
            setStatus('draft');
            setTags('');

	    window.location.reload();
        } catch (error) {
            if (error instanceof z.ZodError) {
                setValidationErrors(error.errors.map(err => err.message));
            }
        }
    };

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <OversiktComponent finnesProsjekter={projects.length > 0} />
            <div id="prosjekter-container">
                {projects.length > 0 ? (
                    projects.map((prosjekt) => (
                        <ProsjektKomponent
                            key={prosjekt.id}
                            prosjekt={prosjekt}
                            slettProsjekt={deleteProject}
                        />
                    ))
                ) : (
                    <p>Ingen prosjekter har blitt funnet.</p>
                )}
            </div>
            <ProsjektformComponent
                handleSubmit={handleSubmit}
                setTittel={setTittel}
                setBeskrivelse={setBeskrivelse}
                setPublishedAt={setPublishedAt}
                setStatus={setStatus}
                setTags={setTags}
            />
            {validationErrors.length > 0 && (
                <div className="validation-errors">
                    <ul>
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <p>Det er til sammen {projects.length} prosjekter som vises på nettstedet.</p>
        </>
    );
};

export default ProjectPage;