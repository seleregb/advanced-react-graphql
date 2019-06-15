import React from "react";
import { Mutation } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import gql from "graphql-tag";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signOut {
      message
    }
  }
`;

export default function SignOut() {
  return (
    <Mutation
      mutation={SIGNOUT_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {signOut => <button onClick={signOut}>Sign Out</button>}
    </Mutation>
  );
}
