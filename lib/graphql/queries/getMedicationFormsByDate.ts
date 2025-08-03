import { gql } from '@apollo/client';

export const GET_MED_FORMS_BY_DATE = gql`
  query GetMedFormsByDate($date: Date!) {
    medicationForms(where: { date: $date }, first: 100) {
      id
      date
      timeGiven
      notes
      medicationEntries {
        medication
        quantity
        unit
      }
    }
  }
`;
