import { BadRequestError } from '../errors/errors.js';
export default function validate(schema) {
    return (req, _, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params
        })

        if (!result.success) {
            throw new BadRequestError("Validation error", result.error.flatten());
        }
        next();
    };
}