export interface AstrologRecord {
  id: number;
  user_title: string;
  personal_note: string;
  tags: string[];
  nasa_date: string; // ISO date string
  nasa_title: string;
  nasa_explanation: string;
  nasa_url: string;
  nasa_media_type: 'image' | 'video' | string;
}

export interface AstrologRecordCreate {
  user_title: string;
  personal_note: string;
  tags?: string[];
  nasa_date: string; // ISO date string
}

export interface AstrologRecordUpdate {
  personal_note?: string;
  tags?: string[];
}
