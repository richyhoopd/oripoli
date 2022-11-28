
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  schedule: {
    appointments: [
      {
        dayTime: {
          type: Date,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    ],
  },
  profileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});


scheduleSchema.methods.addAppointment = function (appointment) {

  const updatedAppointments = [...this.schedule.appointments];

  updatedAppointments.push(appointment);

  const updatedSchedule = {
    appointments: updatedAppointments,
  };

  this.schedule = updatedSchedule;
  return this.save();
};

scheduleSchema.methods.removeAppointment = function (schId) {
  const updatedSchedule = this.schedule.appointments.filter((item) => {
    return item._id.toString() !== schId.toString();
  });
  this.schedule.appointments = updatedSchedule;
  return this.save();
};

module.exports = mongoose.model('Schedule', scheduleSchema);
