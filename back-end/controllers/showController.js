const Show = require("../models/showSchema"); // Mongoose model
const Screen = require("../models/screenSchema")

// Fetch all schedules
exports.getSchedules = async (req, res) => {
  try {
    const { theaterID } = req.params;
    const schedules = await Show.find({theaterId:theaterID}).populate("screenId");
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedSchedule = await Show.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.updateSeats = async (req, res) => {
//   try {
//     const { showId, reservedSeats } = req.body;
//     console.log("showId received:", req.body);

//     console.log("showId received:", showId); // Log the showId

//     // Validate if showId and reservedSeats are present
//     if (!showId || !reservedSeats || reservedSeats.length === 0) {
//       return res.status(400).send({ error: 'showId and reservedSeats are required' });
//     }

//     // Find the show by showId
//     const show = await Show.findById(showId);
//     if (!show) {
//       return res.status(404).send({ error: 'Show not found' });
//     }

//     // Check if the reserved seats are already booked
//     const alreadyBookedSeats = reservedSeats.filter(seat =>
//       show.bookedSeats.includes(seat)
//     );

//     if (alreadyBookedSeats.length > 0) {
//       return res.status(400).send({ error: `These seats are already booked: ${alreadyBookedSeats.join(', ')}` });
//     }

//     // Add the reserved seats to the bookedSeats array
//     show.bookedSeats.push(...reservedSeats);

//     // Optionally, you can remove reserved seats from availableSeats if you have that logic
//     show.availableSeats = show.availableSeats.filter(seat =>
//       !reservedSeats.includes(seat)
//     );

//     // Save the updated show document
//     await show.save();

//     res.send({ message: 'Seats updated successfully' });
//   } catch (error) {
//     console.error('Error updating seats:', error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };

exports.updateSeats = async (req, res) => {
  console.log(req.body)
  const { showId, reservedSeats} = req.body;
  // Validate the showId to ensure it's a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(showId)) {
    return res.status(400).send({ error: 'Invalid showId format' });
  }

  try {
    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).send({ error: 'Show not found' });
    }

    // Add the reserved seats to the bookedSeats array
    show.bookedSeats.push(...reservedSeats);
    await show.save();

    res.send({ message: 'Seats updated successfully' });
  } catch (error) {
    console.error('Error updating seats:', error);
    res.status(500).send({ error: 'Internal Server Error' , error});
  }
};
