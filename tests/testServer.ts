import express, { Application } from 'express'
import bodyParser from 'body-parser'

export const app: Application = express();
app.use(express.json());
app.use(bodyParser.json())
app.get('/', (req, res) => res.json({ message: 'Welcome to anap screening app!!' }));
app.use((req, res) => res.status(404).json({ message: 'No route found' }));
