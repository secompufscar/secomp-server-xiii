import { Request, Response } from "express";
import sponsorsOnTagsService from "../services/sponsorOnTagsService";

export default {
  async link(request: Request, response: Response) {
    const { sponsorId } = request.params;
    const { tagId } = request.body;

    await sponsorsOnTagsService.linkTagToSponsor(sponsorId, tagId);
    return response.status(204).send();
  },

  async unlink(request: Request, response: Response) {
    const { sponsorId, tagId } = request.params;

    await sponsorsOnTagsService.unlinkTagFromSponsor(sponsorId, tagId);
    return response.status(204).send();
  },
};
