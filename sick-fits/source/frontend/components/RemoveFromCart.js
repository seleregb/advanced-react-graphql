import React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  // this gets called as soon as we get a
  // response back from the server as soon as a
  // mutuation has been performed
  update = (cache, payload) => {
    // read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    // remove the item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    // write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typename: "CartItem",
            id: id
          }
        }}
      >
        {(removeFromCart, { error, loading }) => (
          <BigButton
            onClick={() => {
              removeFromCart().catch(err => alert(err.message + id));
            }}
            disabled={loading}
            title="Delete Item"
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
