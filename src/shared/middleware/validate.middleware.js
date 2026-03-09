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
        // Assign transformed/parsed data back to req so controllers get validated values (e.g. Date objects from ISO strings)
        if (result.data.body !== undefined) req.body = result.data.body;
        // Express 5 made req.query read-only; use req.validatedQuery for validated/transformed query params
        if (result.data.query !== undefined) req.validatedQuery = result.data.query;
        if (result.data.params !== undefined) req.params = result.data.params;
        next();
    };
}