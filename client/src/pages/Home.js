import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/fetchPostsQuery";
import { FETCH_USERS_QUERY } from "../util/fetchUsersQuery";
import { useAuth } from "../context/auth";

// since we have cache now, newer 'getPosts' queries will be sent to the 'client' cache and not 'server'
function Home() {
  const { user } = useAuth();
  const { loading: loadingPosts, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  const { loading: loadingUsers, data: { getUsers: users } = {} } =
    useQuery(FETCH_USERS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loadingPosts || loadingUsers ? (
          <h3>Loading posts..</h3>
        ) : (
          <Transition.Group duration={300}>
            {posts &&
              posts.map(post => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard users={users} post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
