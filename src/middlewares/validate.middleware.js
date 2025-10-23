export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = source === 'params' ? req.params :
                   source === 'query' ? req.query :
                   req.body;

      const validated = await schema.parseAsync(data);

      if (source === 'params') {
        req.params = validated;
      } else if (source === 'query') {
        req.query = validated;
      } else {
        req.body = validated;
      }

      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
