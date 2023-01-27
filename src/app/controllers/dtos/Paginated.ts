export interface IPaginatedOutgoingDto<TEntry> {
  totalNumberOfResults: number;
  results: TEntry[];
}
