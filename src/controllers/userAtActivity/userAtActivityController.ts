import { createUserAtActivity  } from "./createUserAtActivityController";
import { getUserAtActivityByActivityId } from "./getAllUsersAtActivityController";
import { deleteUserAtActivity } from "./deleteUserAtActivity";
import { updateUserAtActivity } from "./updateUserAtActivityController";
import { getAllActivitiesByUserId } from "./getAllActivitiesByUserId";

export default {
    createUserAtActivity,
    getUserAtActivityByActivityId,
    deleteUserAtActivity,
    updateUserAtActivity,
    getAllActivitiesByUserId,
};