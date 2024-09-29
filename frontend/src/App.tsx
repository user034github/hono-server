import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import './styles.css';
import React, { useState, useEffect } from 'react';
import OversiktComponent from './OversiktComponent';
import ProsjektformComponent from './ProsjektformComponent';

const App: React.FC = () => {
	const [prosjekter, setProsjekter] = useState<any[]>([]);
	const [tittel, setTittel] = useState('');
	const [beskrivelse, setBeskrivelse] = useState('');

	const fetchProsjekter = async () => {
		try {
			const response = await fetch('http://localhost:3000/prosjekter');
			const data = await response.json();
			if (Array.isArray(data)) {
				setProsjekter(data);
			} else {
				setProsjekter([]);
			}
		} catch (error) {
			console.error('Lesing av prosjekt feilet:', error);
			setProsjekter([]);
		}
	};

	useEffect(() => {fetchProsjekter()}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, tittel: string, beskrivelse: string) => {
		event.preventDefault();
		try {
			const response = await fetch('http://localhost:3000/prosjekter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ tittel, beskrivelse }),
			});

			if (response.ok) {
				setTittel('');
				setBeskrivelse('');
				fetchProsjekter();
			} else {
				console.error('Feil med å legge til prosjekt');
			}
		} catch (error) {
			console.error('Feil:', error);
		}
	};
	
	const slettProsjekt = async (id: number) => {
		try {
			const response = await fetch(`http://localhost:3000/prosjekter/${id}`, {
			method: 'DELETE',
			});
			
			if (response.ok) {
				fetchProsjekter();
			} else {
				console.error('Feil ved sletting av prosjekt');
			}
		} catch (error) {
			console.error('Feil:', error);
		}
	};

	return (
		<React.Fragment>
			<OversiktComponent finnesProsjekter={prosjekter.length > 0} />
			<div id="prosjekter-container">
			{
			prosjekter.length > 0 ? (
				prosjekter.map((prosjekt, index) => (
					<div className="prosjekt" key={index}>
						<h2>{prosjekt.tittel}</h2>
						<p>{prosjekt.beskrivelse}</p>
						<button onClick={() => slettProsjekt(prosjekt.id)}>Slett prosjekt</button>
					</div>
				)
				)
			) : (<p>Ingen prosjekter har blitt funnet.</p>)
			}
			</div>
			<ProsjektformComponent handleSubmit={handleSubmit} setTittel={setTittel} setBeskrivelse={setBeskrivelse} />
			<p>Det er til sammen {prosjekter.length} prosjekter som vises på nettstedet.</p>
		</React.Fragment>
	);
};

export default App;
