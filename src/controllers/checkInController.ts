import { Request, Response } from "express";
import checkInService from "../services/checkInService";
import checkInRepository from "../repositories/checkInRepository";

export default {
  async checkIn(request: Request, response: Response) {
    const { userId, activityId } = request.params;

    console.log("checkin controller: ", userId, activityId);

    const data = await checkInService.checkIn(userId, activityId);

    response.status(200).json(data);
  },
  async listParticipants(request: Request, response: Response) {
    const { activityId } = request.params;

    const participants = await checkInRepository.findParticipantsByActivity(activityId);
    response.status(200).json(participants);
  },
};
