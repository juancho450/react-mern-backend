const Event = require("../models/Event");

const getEvents = async (req, res) => {

    const events = await Event.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        events
    });
}

const createEvent = async (req, res) => {

    const event = new Event(req.body);

    try {
        event.user = req.uid;
        const eventSaved = await event.save();
        res.json({
            ok: true,
            event: eventSaved
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }

}

const updateEvent = async (req, res) => {

    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'You do not have the privilege to edit this event'
            });
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

        res.json({
            ok: true,
            event: updatedEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }

    res.json({
        ok: true,
        eventId
    });
}

const deleteEvent = async (req, res) => {

    const eventId = req.params.id;

    try{

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }
    
        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'You do not have the privilege to delete this event'
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({
            ok: true
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
 


    res.json({
        ok: true,
        msg: 'deleteEvent'
    });
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}