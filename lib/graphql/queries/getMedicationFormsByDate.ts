import { gql } from '@apollo/client';

export const GET_MED_FORMS_BY_DATE = gql`
  query GetMedFormsByDate($date: Date!) {
    medicationForms(where: { date: $date }) {
      id
      date
      timeGiven
      notes
      medicationEntry {
        medication
        quantity
        unit
      }
    }
  }
`;
