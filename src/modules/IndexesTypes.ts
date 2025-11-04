export interface Index {
  id: string | number;
  name: string;
  image: string;
  description: string;
  cardinality?: string;
  tableField?: string;
  positionInQuery?: number;
  rowsCount?: string;
  recievedRows?: string;
  is_delete: boolean;
}