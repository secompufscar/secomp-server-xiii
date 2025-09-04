import activitiesRepository from "../repositories/activitiesRepository";
import usersAtActivitiesRepository from "../repositories/usersAtActivitiesRepository";
import { ApiError, ErrorsCode } from "../utils/api-errors";
import { UpdateActivityDTOS, CreateActivityDTOS, ActivityDTOS } from "../dtos/activitiesDtos";
import schedulerService from "./schedulerService";
import { Activity } from '@prisma/client';

export default {
  async findById(id: string): Promise<ActivityDTOS> {
    const atividade = await activitiesRepository.findById(id);

    if (!atividade) {
      throw new ApiError("Atividade não encontrada", ErrorsCode.NOT_FOUND);
    }

    return atividade;
  },

  async list(): Promise<ActivityDTOS[]> {
    const activities = await activitiesRepository.list();
    return activities;
  },

  async create({
    nome,
    data,
    palestranteNome,
    categoriaId,
    vagas,
    detalhes,
    local,
    points,
  }: CreateActivityDTOS): Promise<ActivityDTOS> {
    const newData = data ? new Date(data) : null;

    const newAtividade = await activitiesRepository.create({
      nome,
      data: newData,
      palestranteNome,
      categoriaId,
      vagas,
      detalhes,
      local,
      points,
    });

    schedulerService.scheduleNotificationsForActivity(newAtividade as Activity);

    return newAtividade;
  },

  async update(
    id: string,
    { nome, data, palestranteNome, vagas, categoriaId, detalhes, local, points }: UpdateActivityDTOS,
  ): Promise<UpdateActivityDTOS> {
    const existingAtividade = await activitiesRepository.findById(id);

    if (!existingAtividade) {
      throw new ApiError("Atividade não encontrada", ErrorsCode.NOT_FOUND);
    }

    const updatedAtividade = await activitiesRepository.update(id, {
      nome,
      data,
      vagas,
      palestranteNome,
      categoriaId,
      detalhes,
      local,
      points,
    });

    schedulerService.scheduleNotificationsForActivity(updatedAtividade as Activity);

    return updatedAtividade;
  },

  async delete(id: string): Promise<void> {
    await usersAtActivitiesRepository.deleteByActivityId(id);
    await activitiesRepository.delete(id);
  },
};
