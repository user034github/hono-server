const baseUrl = 'http://localhost:3000';

const endpoints = {
	projects: `${baseUrl}/prosjekter`,
	deleteProject: (id: number) => `${baseUrl}/prosjekter/${id}`
};

export default endpoints;