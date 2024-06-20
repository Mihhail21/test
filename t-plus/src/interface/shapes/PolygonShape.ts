export interface IPolygonShape {
  id: number;
  type: "PolygonShape";
  x: number;
  y: number;
  points: number[]; 
  fill: string; 
  stroke: string;
  strokeWidth?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number; 
}
