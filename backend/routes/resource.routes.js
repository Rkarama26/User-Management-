const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth,.middleware");
const ResourceModel = require("../models/resource.model");

const resourceModelRouter = express.Router();

// POST /resourceModels - Create resourceModel (any logged-in user)
resourceModelRouter.post(
  "/",
  authMiddleware(["admin", "moderator", "user"]),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("body").notEmpty().withMessage("Body is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, body } = req.body;
      const resourceModel = new ResourceModel({
        title,
        body,
        owner: req.user.id,
      });
      await resourceModel.save();
      res.status(201).json(resourceModel);
    } catch (error) {
      console.error("Error creating resourceModel:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

//- View all resourceModels (any logged-in user)
resourceModelRouter.get("/", authMiddleware(), async (req, res) => {
  try {
    const resourceModels = await ResourceModel.find()
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json(resourceModels);
  } catch (error) {
    console.error("Error fetching resourceModels:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// - View single resourceModel
resourceModelRouter.get("/:id", authMiddleware(), async (req, res) => {
  try {
    const resourceModel = await ResourceModel.findById(req.params.id).populate(
      "owner",
      "name email role"
    );
    if (!resourceModel)
      return res.status(404).json({ error: "ResourceModel not found" });
    res.status(200).json(resourceModel);
  } catch (error) {
    console.error("Error fetching resourceModel:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  - Update (owner, moderator, or admin only)
resourceModelRouter.put(
  "/:id",
  authMiddleware(["admin", "moderator", "user"]),
  [
    body("title").optional().notEmpty(),
    body("body").optional().notEmpty(),
  ],
  async (req, res) => {
    try {
      const resourceModel = await ResourceModel.findById(req.params.id);
      if (!resourceModel)
        return res.status(404).json({ error: "ResourceModel not found" });

      const isOwner = resourceModel.owner.toString() === req.user.id;
      const isPrivileged = ["admin", "moderator"].includes(req.user.role);
      if (!isOwner && !isPrivileged)
        return res
          .status(403)
          .json({ error: "Access denied: insufficient permissions" });

      const { title, body } = req.body;
      if (title) resourceModel.title = title;
      if (body) resourceModel.body = body;
      await resourceModel.save();

      res.status(200).json({ message: "ResourceModel updated", resourceModel });
    } catch (error) {
      console.error("Error updating resourceModel:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// - Delete (owner, moderator, or admin)
resourceModelRouter.delete("/:id", authMiddleware(["admin", "moderator", "user"]), async (req, res) => {
  try {
    const resourceModel = await ResourceModel.findById(req.params.id);
    if (!resourceModel)
      return res.status(404).json({ error: "ResourceModel not found" });

    const isOwner = resourceModel.owner.toString() === req.user.id;
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);
    if (!isOwner && !isPrivileged)
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });

    await resourceModel.deleteOne();
    res.status(200).json({ message: "ResourceModel deleted successfully" });
  } catch (error) {
    console.error("Error deleting resourceModel:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = resourceModelRouter;
