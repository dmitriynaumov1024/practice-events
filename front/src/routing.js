import { defineRoutes } from "@lib/defineRoutes.js"

import index from "./page/index.js"

import calendar from "./page/calendar/index.js"

import tags from "./page/tags/index.js"

import eventList from "./page/event/list.js"
import eventView from "./page/event/view.js"
import eventEdit from "./page/event/edit.js"

import visitList from "./page/visit/list.js"
import visitView from "./page/visit/view.js"
import visitEdit from "./page/visit/edit.js"

import notificationList from "./page/notification/list.js"
import notificationView from "./page/notification/view.js"
import notificationEdit from "./page/notification/edit.js"

import profileLogin from "./page/profile/login.js"
import profileSignup from "./page/profile/signup.js"
import profileView from "./page/profile/view.js"
import profileEdit from "./page/profile/edit.js"

import test from "./page/test.js"


export default defineRoutes([
    { path: "/", component: index },
    { path: "/index", component: index },
    
    { path: "/calendar", component: calendar, props: { year: Number, month: Number, day: Number, page: Number, tag: String } },
   
    { path: "/tags", component: tags, props: { page: Number } },

    { path: "/event/list", component: eventList, props: { page: Number, archive: Boolean, tag: String, owner: Number } },
    { path: "/event/view", component: eventView, props: { id: Number } },
    { path: "/event/edit", component: eventEdit, props: { id: Number } },

    { path: "/visit/list", component: visitList, props: { page: Number, event: Number, approved: Boolean, archive: Boolean } },
    { path: "/visit/view", component: visitView, props: { person: Number, event: Number } },
    { path: "/visit/edit", component: visitEdit, props: { person: Number, event: Number, create: Boolean } },

    { path: "/notification/list", component: notificationList, props: { page: Number, archive: Boolean } },
    { path: "/notification/view", component: notificationView, props: { event: Number } },
    { path: "/notification/edit", component: notificationEdit, props: { event: Number, create: Boolean } },

    { path: "/profile/login", component: profileLogin },
    { path: "/profile/signup", component: profileSignup },
    { path: "/profile/view", component: profileView },
    { path: "/profile/edit", component: profileEdit },

    { path: "/test", component: test }
])
