import { Button, Icon, Confirm } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useState } from "react";
import { FETCH_POSTS_QUERY } from "../util/fetchPostsQuery";
import MyPopup from "../util/MyPopup";

export default function DeleteButton({ commentId, postId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  // commentId is present only when we use "<DeleteButton/>" in "SinglePost"
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    variables: {
      postId,
      commentId, //if we are not deleting comment then this value will be ignored
    },

    update(proxy) {
      setConfirmOpen(false); //closes the Confirmation modal

      // delete the post
      if (!commentId) {
        // we also need to delete the post from the cache, else it will keep displaying it, as we are not returning any post on deleting due to this apollo client is not automatically able to update the cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
          variables: postId,
        });

        data.getPosts = data.getPosts.filter(post => post.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data, variables: postId });
      }

      if (callback) callback(); //because we don't have callback <DeleteButton/> in the "PostCard"
    },
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          color="red"
          onClick={() => setConfirmOpen(true)}
          floated="right"
        >
          <Icon name="trash" className="no-margin" />
        </Button>
      </MyPopup>
      {/* confirm modal "open" takes a boolean */}
      <Confirm
        open={confirmOpen}
        onCancel={() => {
          // on cancelling we want to close the modal
          setConfirmOpen(false);
        }}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      # on deleting a comment it returns the post with a id, apollo automatically updates the cache
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
