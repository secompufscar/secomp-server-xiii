export interface CreateActivityImageDTOS {
    activityId: string
    typeOfImage : string
    imageUrl : string
}

export interface UpdateActivityImageDTOS {
    activityId: string
    typeOfImage: string
    imageUrl : string
}
export interface ActivityImageDTOS {
    id: string
    activityId: string
    typeOfImage: string
    imageUrl: string
}