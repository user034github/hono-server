import React from 'react';

interface ProsjektKomponentProps {
	prosjekt: {
    		id: number;
		tittel: string;
    		beskrivelse: string;
		publishedAt: string;
		status: 'draft' | 'published';
		tags: string;
  	};
  	slettProsjekt: (id: number) => void;
}

const ProsjektKomponent: React.FC<ProsjektKomponentProps> = ({ prosjekt, slettProsjekt }) => {
	return (
		<div className="prosjekt">
			<h2>{prosjekt.tittel}</h2>
			<p>{prosjekt.beskrivelse}</p>
			<p>Published At: {prosjekt.publishedAt}</p>
            		<p>Status: {prosjekt.status}</p>
            		<p>Tags: {prosjekt.tags}</p>
			<button onClick={() => slettProsjekt(prosjekt.id)}>Slett prosjekt</button>
		</div>
  	);
};

export default ProsjektKomponent;