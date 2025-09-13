import express from 'express';
const router = express.Router();

router.get('/register', (req, res) => {
  res.send('register endpoint');
});
router.get('/login', (req, res) => {
  res.send('login endpoint');
});
router.get('/logout', (req, res) => {
  res.send('logout endpoint');
});

export default router;