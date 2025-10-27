const express = require('express');
const captionController = require('../controllers/captionController');
const { authenticate } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('image'), captionController.createCaption);
router.get('/', captionController.getCaptions);
router.get('/:id', captionController.getCaption);
router.delete('/:id', captionController.deleteCaption);

module.exports = router;