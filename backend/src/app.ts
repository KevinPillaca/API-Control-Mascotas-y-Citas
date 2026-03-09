import express from 'express';
import cors from 'cors';
import { router as authRoutes } from './modules/auth/auth.routes';
import { router as clienteRoutes } from './modules/clientes/clientes.routes';
import { router as mascotaRoutes } from './modules/mascotas/mascotas.routes';
import { router as citasRoutes } from './modules/citas/citas.routes';
import { router as diagnosticosRoutes } from './modules/diagnosticos/diagnosticos.routes';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/mascotas', mascotaRoutes);
app.use('/citas', citasRoutes);
app.use('/diagnosticos', diagnosticosRoutes);

export default app;