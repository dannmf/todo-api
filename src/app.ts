import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
})

app.use((err: Error, req: express.Request, res: express.Response, next:
    express.NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

export default app;

