import { Event, User } from "../db.js";

export const createEvent = (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !date) return res.status(400).json({ message: "Missing fields" });
  Event.create({ title, description: description || "", date, created_by: req.user.id })
    .then((ev) => res.status(201).json(ev))
    .catch((e) => res.status(500).json({ message: "Internal Server Error", error: e.message }));
};

export const listEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ include: [{ model: User, as: "creator", attributes: ["name"] }], order: [["date", "DESC"]] })
    return res.json(events)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
};

export const getEvent = (req, res) => {
  Event.findByPk(req.params.id)
    .then((ev) => {
      if (!ev) return res.status(404).json({ message: "Not found" });
      res.json(ev);
    })
    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
};

export const updateEvent = (req, res) => {
  const { title, description, date } = req.body;
  Event.update({ title, description, date }, { where: { id: req.params.id, created_by: req.user.id } })
    .then(([affected]) => {
      if (!affected) return res.status(404).json({ message: "Not found or not allowed" });
      res.json({ message: "Updated" });
    })
    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
};

export const deleteEvent = (req, res) => {
  Event.destroy({ where: { id: req.params.id, created_by: req.user.id } })
    .then((deleted) => {
      if (!deleted) return res.status(404).json({ message: "Not found or not allowed" });
      res.json({ message: "Deleted" });
    })
    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
};
