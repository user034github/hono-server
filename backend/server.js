import { Hono } from "hono";
import { serve } from "@hono/node-server";
import fs from 'fs/promises';
import path from 'path';

const app = new Hono();

app.use('*', (context, next) => {
    context.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    context.header('Access-Control-Allow-Methods', 'GET, POST, DELETE'); 
    context.header('Access-Control-Allow-Headers', 'Content-Type'); 
    return next();
});

app.options('*', (context) => context.text('OK', 204));

app.get("/", async (context) => {
    const filePath = path.resolve("../frontend/index.html");
    try {
        const html = await fs.readFile(filePath, "utf8");
        return context.text(html, 200, { "Content-Type": "text/html" });
    } catch (error) {
        return context.text(`Feil: ${error.message}`, 500, { "Content-Type": "text/plain" });
    }
});

app.get("/prosjekter", async (context) => {
    const filePath = path.resolve("prosjekter.json");
    try {
        const json = await fs.readFile(filePath, "utf8");
        return context.text(json, 200, { "Content-Type": "application/json" });
    } catch (error) {
        console.error(`Feil: ${error.message}`);
        return context.text(`Feil: ${error.message}`, 500, { "Content-Type": "text/plain" });
    }
});

app.post('/prosjekter', async (context) => {
	const data = await context.req.json();
	const filePath = path.resolve('prosjekter.json');

	try {
		const fileContent = await fs.readFile(filePath, 'utf8');
		const prosjekter = JSON.parse(fileContent);

		const nyttId = prosjekter.length > 0 ? prosjekter[prosjekter.length - 1].id + 1 : 1;
		const nyttProsjekt = { id: nyttId, ...data };
		prosjekter.push(nyttProsjekt);
	
		await fs.writeFile(filePath, JSON.stringify(prosjekter, null, 2));

		return context.json({ message: 'Prosjekt har blitt lagt til', project: nyttProsjekt });
  } catch (error) {
	  return context.json({ error: `Feil: ${error.message}` }, 500);
  }
});

app.delete('/prosjekter/:id', async (context) => {
	const id = Number(context.req.param('id'));
	const filePath = path.resolve('prosjekter.json');

	try {
		const fileContent = await fs.readFile(filePath, 'utf8');
		let prosjekter = JSON.parse(fileContent);
		const oppdaterteProsjekter = prosjekter.filter((prosjekt) => prosjekt.id !== id);

		if (prosjekter.length === oppdaterteProsjekter.length) {
			return context.json({ error: 'Prosjekt har ikke blitt funnet' }, 404);
		}
		await fs.writeFile(filePath, JSON.stringify(oppdaterteProsjekter, null, 2));

		return context.text('Prosjekt har blitt slettet', 200);
	} catch (error) {
		return context.json({ error: `Feil: ${error.message}` }, 500);
  }
});

serve({ port: 3000, fetch: app.fetch }, (x) => console.log(`Serveren er aktiv: ${x.port}`));
