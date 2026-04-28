export interface MarsPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsSearchResponse {
  photos: MarsPhoto[];
}

export interface MarsFavoriteCreate {
  rover_name: string;
  camera_name?: string;
  earth_date: string;
  sol?: number;
  image_url: string;
}

export interface MarsFavorite {
  id: number;
  rover_name: string;
  camera_name?: string;
  earth_date: string;
  sol?: number;
  image_url: string;
  is_favorite: boolean;
  created_at: string;
}
