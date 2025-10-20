export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflito',
        message: 'Já existe um registro com esses dados',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Registro não encontrado',
      });
    }
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.url} não existe`,
  });
};
