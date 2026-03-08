import userService from "./users.services.js";
import { successResponse } from "../../shared/utils/response.js";

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await userService.signup(name, email, password);
    successResponse(res, user, "User created successfully", 201);
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    successResponse(res, user, "User logged in successfully", 200);
}

export default {
    signup,
    login
}