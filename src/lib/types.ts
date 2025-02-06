export interface Note {
  id: string;
  title: string;
  content: string;
  website: string;
  color: 'yellow' | 'pink' | 'blue';
  position: {
    x: number;
    y: number;
  };
}