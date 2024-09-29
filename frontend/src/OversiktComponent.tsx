import React, { useState } from 'react';

interface Props {
	finnesProsjekter: boolean;
}

const OversiktComponent: React.FC<Props> = ({ finnesProsjekter }) => { 
	const [visDetaljer, setVisDetaljer] = useState<boolean>(false);

	const toggleDetaljer = () => {
		setVisDetaljer(state => !state);
	};

	return (
		<div>
			<h1>Prosjekt oversikt</h1>
			{finnesProsjekter ? (<p>Dette er mine prosjekter så langt:</p>) : (<p>Det er ingen prosjekter på nåværende tidspunkt.</p> )}
			<button onClick={toggleDetaljer}>{visDetaljer ? "Skjul detaljer" : "Vis detaljer"}</button>
			{visDetaljer && finnesProsjekter && (<div><p>Her kan du se detaljene om prosjektene.</p></div>)}
		</div>
	);
};

export default OversiktComponent;
