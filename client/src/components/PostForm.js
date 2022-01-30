import { Button, Form } from "semantic-ui-react";
import { useForm } from "../util/useForm";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/fetchPostsQuery";

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  // with this proxy variable we will be able to access the cache memory which contains the post data instead of accessing the posts from server, so this will query the cache instead of server

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
        variables: values,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, variables: values, data });
      values.body = "";
    },
  });
  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post</h2>
        <Form.Input
          placeholder="What's on your mind..."
          name="body"
          value={values.body}
          onChange={onChange}
          type="text"
          error={error ? true : false}
        />
        <Button type="submit" color="teal">
          Post
        </Button>
      </Form>
      {error && (
        <div style={{ marginBottom: "20px" }} className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;
