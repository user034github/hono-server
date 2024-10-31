import { Hono } from "hono";
import { serve } from "@hono/node-server";
import sqlite3 from 'better-sqlite3';
import path from 'path';

const app = new Hono();

const dbPath = path.resolve('projects.db');
const db = sqlite3(dbPath, { verbose: console.log }); 

app.use('*', (context, next) => {
	context.header('Access-Control-Allow-Origin', 'http://localhost:5173');
	context.header('Access-Control-Allow-Methods', 'GET, POST, DELETE'); 
	context.header('Access-Control-Allow-Headers', 'Content-Type'); 
	return next();
});

app.options('*', (context) => context.text('OK', 204));

const initDb = () => {
	db.exec(`
		CREATE TABLE IF NOT EXISTS prosjekter (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			tittel TEXT NOT NULL,
			beskrivelse TEXT NOT NULL,
			publishedAt TEXT,
			status TEXT CHECK(status IN ('draft', 'published')),
			tags TEXT
		)
	`);
};

app.get("/prosjekter", async (context) => {
	try {
		const projects = db.prepare("SELECT * FROM prosjekter").all();
		return context.json(projects);
	} catch (error) {
		console.error(`Feil: ${error.message}`);
		return context.text(`Feil: ${error.message}`, 500);
	}
});

app.post('/prosjekter', async (context) => {
	const data = await context.req.json();
	try {
		const stmt = db.prepare("INSERT INTO prosjekter (tittel, beskrivelse, publishedAt, status, tags) VALUES (?, ?, ?, ?, ?)");
		const result = stmt.run(data.tittel, data.beskrivelse, data.publishedAt, data.status, data.tags);
		
		const newProject = { id: result.lastInsertRowid, ...data };
		return context.json({ message: 'Prosjekt har blitt lagt til', project: newProject });
	} catch (error) {
		return context.json({ error: `Feil: ${error.message}` }, 500);
	}
});

app.delete('/prosjekter/:id', async (context) => {
	const id = Number(context.req.param('id'));
	try {
		const stmt = db.prepare("DELETE FROM prosjekter WHERE id = ?");
		const result = stmt.run(id);
		
		if (result.changes === 0) {
			return context.json({ error: 'Prosjekt ikke funnet' }, 404);
		}
		return context.text('Prosjekt har blitt fjernet', 200);
	} catch (error) {
		return context.json({ error: `Error: ${error.message}` }, 500);
	}
});

const startServer = () => {
	initDb(); 
	serve({ port: 3000, fetch: app.fetch }, (x) => console.log(`Serveren er aktiv: ${x.port}`));
};

startServer();
