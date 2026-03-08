const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const requireUser = require('../middlewares/requireUser');
const { getSummary, getMonthlyTrends } = require('../controllers/summaryController');

const router = express.Router();

router.use(authenticateToken);
router.use(requireUser);

router.get('/trends', async (req, res, next) => {
    try {
        const trends = await getMonthlyTrends(req.user.userId);
        return res.status(200).json(trends);
    } catch (error) {
        return next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const summary = await getSummary(req.user.userId, req.query.month);
        return res.status(200).json(summary);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
