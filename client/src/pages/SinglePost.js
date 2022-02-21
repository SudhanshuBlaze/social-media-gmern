import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Image,
  Icon,
  Form,
  Label,
  Button,
  Card,
  Grid,
} from "semantic-ui-react";
import moment from "moment";
import { useAuth } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import MyPopup from "../util/MyPopup";
import { FETCH_USERS_QUERY } from "../util/fetchUsersQuery";

export default function SinglePost() {
  const { postId } = useParams(); // accessing the parameters from the path

  const { user } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const { data: { getUsers: users } = {} } = useQuery(FETCH_USERS_QUERY);

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: { postId, body: comment },
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
  });

  function deletePostCallback() {
    navigate("/");
  }

  let postMarkup;

  if (!getPost || !users) {
    postMarkup = <p>Loading..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    const currPostUser = users.find(user => user.username === username);
    const defaultAvatarUrl =
      "https://www.alpeaudio.com/wp-content/uploads/2021/08/generic_avatar.webp";

    const avatarUrl = currPostUser && (currPostUser.avatar || defaultAvatarUrl);

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image floated="right" size="small" src={avatarUrl} />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>

              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                {/* comment button */}

                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("Comment on post")}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>

                {/* Delete post button */}
                {user && user.username === username && (
                  <DeleteButton callback={deletePostCallback} postId={postId} />
                )}
              </Card.Content>
            </Card>

            {/* create a comment Input field and button */}
            {user && (
              <Card fluid>
                {/* Card content gives padding  */}
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {/* display all comments */}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {/* delete comment button */}
                  {user && user.username === comment.username && (
                    <DeleteButton postId={postId} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>
                    {moment(comment.createdAt).fromNow(true)}
                  </Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;
