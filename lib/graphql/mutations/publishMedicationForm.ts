import { gql } from '@apollo/client';

export const PUBLISH_MED_FORM = gql`
  mutation PublishMedForm($id: ID!) {
    publishMedicationForm(where: { id: $id }) {
      id
    }
  }
`;
