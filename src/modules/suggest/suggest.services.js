import { getSuggest } from "../../shared/services/ai.service.js";
import transactionsServices from "../transactions/transactions.services.js";

const getSuggestion = async ({ userId ,user, ask }) => {
    const data = await transactionsServices.getAllTransactions({ userId });
    const suggest = await getSuggest(ask, data, user);
    return suggest;
}

export default { getSuggestion };