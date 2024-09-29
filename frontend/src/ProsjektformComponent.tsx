import React, { useState } from 'react';

interface Props {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>, tittel: string, beskrivelse: string) => void;
	setTittel: React.Dispatch<React.SetStateAction<string>>;
	setBeskrivelse: React.Dispatch<React.SetStateAction<string>>;
}

const ProsjektformComponent: React.FC<Props> = ({ handleSubmit, setTittel, setBeskrivelse }) => {
	const [tittel, localSetTittel] = useState<string>('');
	const [beskrivelse, localSetBeskrivelse] = useState<string>('');

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		handleSubmit(e, tittel, beskrivelse);
		localSetTittel('');
		localSetBeskrivelse('');
	};

	return (
		<form id="legg-til-prosjekt-form" onSubmit={onSubmit}>
			<h2>Legg til et nytt prosjekt</h2>
			<input type="text" id="prosjekt-tittel" placeholder="Prosjekt Tittel" required value={tittel} 
			onChange={(e) => localSetTittel(e.target.value)}/>
			<textarea id="prosjekt-beskrivelse" placeholder="Prosjekt Beskrivelse" required value={beskrivelse}
			onChange={(e) => localSetBeskrivelse(e.target.value)} />
			<button type="submit">Legg til et prosjekt</button>
		</form>
	);
};

export default ProsjektformComponent;