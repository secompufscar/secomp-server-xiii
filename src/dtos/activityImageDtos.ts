export interface CreateActivityImageDTOS {
  activityId: string;
  typeOfImage: string;
  mimeType: string;
  image: Buffer;
}

export interface UpdateActivityImageDTOS {
  activityId: string;
  typeOfImage?: string;
  mimeType?: string;
  image?: Buffer;
}

export interface ActivityImageDTOS {
  id: string;
  activityId: string;
  typeOfImage: string;
  mimeType: string;
  image: Buffer;
}

export interface ActivityImageSummaryDTOS {
  id: string;
  activityId: string;
  typeOfImage: string;
  mimeType: string;
}

export interface CreateActivityImageSummaryDTOS {
  id: string;
  activityId: string;
  typeOfImage: string;
  mimeType: string;
}

export interface UpdateActivityImageSummaryDTOS {
  id: string;
  activityId: string;
  typeOfImage: string;
  mimeType: string;
}

export interface ActivityImageBufferDTOS {
  id: string;
  mimeType: string;
  image: Buffer;
}
