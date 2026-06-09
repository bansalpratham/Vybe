import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { getNotifications, markNotificationsAsRead } from '../controllers/notification.controllers.js'

const notificationRouter = express.Router()

notificationRouter.get("/", isAuth, getNotifications)
notificationRouter.put("/read", isAuth, markNotificationsAsRead)

export default notificationRouter
