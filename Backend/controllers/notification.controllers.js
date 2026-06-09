import Notification from "../models/notification.model.js"

// Utility helper to create notification
export const createNotification = async (senderId, receiverId, type, postOrLoopId, isLoop = false) => {
    try {
        if (!senderId || !receiverId) return
        if (senderId.toString() === receiverId.toString()) return // Don't notify self

        const payload = {
            sender: senderId,
            receiver: receiverId,
            type
        }
        if (postOrLoopId) {
            if (isLoop) {
                payload.loop = postOrLoopId
            } else {
                payload.post = postOrLoopId
            }
        }
        await Notification.create(payload)
    } catch (error) {
        console.error("Error creating notification:", error)
    }
}

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.userId })
            .populate("sender", "name userName profileImage")
            .populate("post", "media mediaType")
            .populate("loop", "media")
            .sort({ createdAt: -1 })
            .limit(50)

        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({ message: `get notifications error: ${error}` })
    }
}

export const markNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { receiver: req.userId, isRead: false },
            { $set: { isRead: true } }
        )
        return res.status(200).json({ message: "Notifications marked as read" })
    } catch (error) {
        return res.status(500).json({ message: `mark notifications as read error: ${error}` })
    }
}
