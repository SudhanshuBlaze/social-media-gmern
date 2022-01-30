import { Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import MyPopup from "../util/MyPopup";

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    // we don't need to update cache here, because like mutation returns a "post" with id, so apollo-client automatically updates the cache
  });

  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const likeButton = () => {
    return user ? (
      liked ? (
        <Button color="teal">
          <Icon name="heart" />
        </Button>
      ) : (
        <Button color="teal" basic>
          <Icon name="heart" />
        </Button>
      )
    ) : (
      <Button as={Link} to="/login" color="teal" basic>
        <Icon name="heart" />
      </Button>
    );
  };

  return (
    <MyPopup content={liked ? "Unlike" : "Like"}>
      <Button as="div" labelPosition="right" onClick={likePost}>
        {likeButton()}
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id #with the help of this "id" apollo client automatically updates the post
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
