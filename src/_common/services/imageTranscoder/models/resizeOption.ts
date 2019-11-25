export type ResizeOption =
  | '%' /** Width and height are specified in percents */
  | '@' /** Specify maximum area in pixels */
  | '!' /** Ignore aspect ratio */
  | '^' /** Width and height are minimum values */
  | '<' /** Change dimensions only if image is smaller than width or height */
  | '>' /** Change dimensions only if image is larger than width or height */
