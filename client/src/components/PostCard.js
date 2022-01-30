import { Card, Button, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";

export default function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useAuth();

  function commentPost() {
    console.log("comment on post");
  }

  return (
    <Card fluid>
      <Card.Content as={Link} to={`posts/${id}`}>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>

        {/* this function shows relative time of post, "true" params is to remove "ago" */}
        <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>

      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <MyPopup content="Comment on post">
          <Button
            labelPosition="right"
            onClick={commentPost}
            as={Link}
            to={`/posts/${id}`}
          >
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}
