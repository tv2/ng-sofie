export type ActionType = PartActionType | PieceActionType | PlaceholderActionType

export enum PartActionType {
  INSERT_PART_AS_ON_AIR = 'INSERT_PART_AS_ON_AIR',
  INSERT_PART_AS_NEXT = 'INSERT_PART_AS_NEXT',
}

export enum PieceActionType {
  INSERT_PIECE_AS_ON_AIR = 'INSERT_PIECE_AS_ON_AIR',
  INSERT_PIECE_AS_NEXT = 'INSERT_PIECE_AS_NEXT',
  INSERT_PIECE_AS_NEXT_AND_TAKE = 'INSERT_PIECE_AS_NEXT_AND_TAKE',
  REPLACE_PIECE = 'REPLACE_PIECE',
}

export enum PlaceholderActionType {
  CONTENT = 'CONTENT',
}

export enum PlaceholderActionScope {
  ON_AIR_SEGMENT = 'ON_AIR_SEGMENT',
}
