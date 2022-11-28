
const express = require('express');


const schCtrl = require('../controllers/schedule-ctrl');


const router = express.Router();



router.get('/profile/:profileId', schCtrl.getEditProfile);


router.get('/profile', schCtrl.getProfile);


router.post('/profile', schCtrl.postProfile);


router.post('/add-appointment', schCtrl.postAppointment);

router.get('/load/:profileId/:date', schCtrl.getScheduleData);

router.post('/delete/:profileId/:schId', schCtrl.deleteAppointment);


router.get('/', schCtrl.getSchedule);

module.exports = router;
