import suggestService from "./suggest.services.js";
import { successResponse } from "../../shared/utils/response.js";

const getSuggest = async (req, res) => {
  const { ask } = req.query;
  const userId = req.user.id;
  const user = req.user;
  const suggest = await suggestService.getSuggestion({ userId, user, ask });
  successResponse(res, suggest, "Suggest fetched successfully", 200);
};

export default { getSuggest };
