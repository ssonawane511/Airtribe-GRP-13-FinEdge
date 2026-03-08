const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser
} = require('../controllers/usersController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/signup', async (req, res, next) => {
    try {
        const user = req.body;
        const dbUser = await registerUser(user);
        res.status(201).json(dbUser);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = req.body;
        const dbUser = await loginUser(user);
        res.status(200).json(dbUser);
    } catch (error) {
        next(error);
    }
});

// All routes declared after this line are protected.
router.use(authenticateToken);

router.get('/verify-token', (req, res) => {
    res.status(200).json({
        message: 'Token is valid',
        user: req.user
    });
});

module.exports = router;
