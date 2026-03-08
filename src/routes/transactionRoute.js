const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const requireUser = require('../middlewares/requireUser');
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionsController');

const router = express.Router();

router.use(authenticateToken);
router.use(requireUser);

router.post('/', async (req, res, next) => {
    try {
        const transaction = await createTransaction(req.user.userId, req.body);
        return res.status(201).json(transaction);
    } catch (error) {
        return next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const transactions = await getTransactions(req.user.userId, req.query);
        return res.status(200).json(transactions);
    } catch (error) {
        return next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const transaction = await getTransactionById(req.user.userId, req.params.id);
        return res.status(200).json(transaction);
    } catch (error) {
        return next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const transaction = await updateTransaction(req.user.userId, req.params.id, req.body);
        return res.status(200).json(transaction);
    } catch (error) {
        return next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const result = await deleteTransaction(req.user.userId, req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
