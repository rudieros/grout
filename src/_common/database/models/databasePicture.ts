export interface DatabasePicture {
  original: string
  medium?: string
  small?: string
}

export const DatabasePictureSchema = {
  type: 'map',
  map: {
    original: {
      type: String,
      required: true,
    },
    small: {
      type: String,
    },
    medium: {
      type: String,
    },
  },
}
