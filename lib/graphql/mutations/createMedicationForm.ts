import { gql } from '@apollo/client';

export const CREATE_MED_FORM = gql`
  mutation CreateMedicationForm(
    $createdAt: DateTime!
    $date: Date!
    $timeGiven: String!
    $notes: String!
    $medicationEntries: MedicationEntryCreateManyInlineInput!
  ) {
    createMedicationForm(
      data: {
        createdAt: $createdAt
        date: $date
        timeGiven: $timeGiven
        notes: $notes
        medicationEntries: $medicationEntries
      }
    ) {
      id
    }
  }
`;
