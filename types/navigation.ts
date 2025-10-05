export type RootStackParamList = {
  Home: undefined;
  Results: undefined;
  SeatSelection: { boatId: string };
  Booking: { boatId: string; seats: string[] };
  Confirmation: undefined;
};