const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message).join(", ") });
        }
        next();
    }
}

export default validateSchema;