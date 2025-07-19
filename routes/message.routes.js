const express = require("express");
const Message = require("../models/message.model");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get conversation between two users
router.get("/conversation/:userId", verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender_id: currentUserId, receive_id: userId },
        { sender_id: userId, receive_id: currentUserId },
      ],
    })
      .populate("sender_id", "name email")
      .populate("receive_id", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// Mark messages as read
router.patch("/mark-read/:conversationUserId", verifyToken, async (req, res, next) => {
  try {
    const { conversationUserId } = req.params;
    const currentUserId = req.user._id;

    await Message.updateMany(
      {
        sender_id: conversationUserId,
        receive_id: currentUserId,
        is_read: false,
      },
      {
        is_read: true,
        read_at: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    next(error);
  }
});

// Get user's conversations
router.get("/conversations", verifyToken, async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender_id: currentUserId }, { receive_id: currentUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender_id", currentUserId] },
              "$receive_id",
              "$sender_id",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receive_id", currentUserId] },
                    { $eq: ["$is_read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          user: {
            _id: 1,
            name: 1,
            email: 1,
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;