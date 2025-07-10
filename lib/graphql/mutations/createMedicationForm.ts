import { gql } from '@apollo/client';

export const CREATE_MED_FORM = gql`
  mutation CreateMedForm(
    $medicationEntry: MedicationEntryCreateInput!,
    $timeGiven: String!,
    $notes: String!,
    $date: Date!,
    $createdAt: DateTime!
  ) {
    createMedicationForm(
      data: {
        medicationEntry: { create: $medicationEntry },
        timeGiven: $timeGiven,
        notes: $notes,
        date: $date,
        createdAt: $createdAt
      }
    ) {
      id
    }
  }
`;
