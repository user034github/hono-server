import React, { useState } from 'react';

interface Props {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    setTittel: (value: string) => void;
    setBeskrivelse: (value: string) => void;
    setPublishedAt: (value: string) => void;
    setStatus: (value: 'draft' | 'published') => void; 
    setTags: (value: string) => void; 
}

const ProsjektformComponent: React.FC<Props> = ({
    handleSubmit,
    setTittel,
    setBeskrivelse,
    setPublishedAt,
    setStatus,
    setTags
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <input
              	type="text"
                onChange={(e) => setTittel(e.target.value)}
                placeholder="Tittel"
            />
            <textarea
                onChange={(e) => setBeskrivelse(e.target.value)}
                placeholder="Beskrivelse"
            ></textarea>
            <input
                type="date"
                onChange={(e) => setPublishedAt(e.target.value)}
                placeholder="Published At"
            />
            <select
                onChange={(e) => {
                    setStatus(e.target.value as 'draft' | 'published');
                }}
	    >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
            </select>
            <input
                type="text"
		onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (Kommaseparert)"
            />
            <button type="submit">Legg til et nytt prosjekt</button>
        </form>
    );
};

export default ProsjektformComponent;